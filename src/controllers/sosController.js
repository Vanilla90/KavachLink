import { emergencyEvents } from '../config/db.js';

export const receiveSos = (req, res) => {
  const payload = req.body;
  const { packet_id } = payload;

  if (emergencyEvents.has(packet_id)) {
    return res.status(200).json({
      success: true,
      status: "DUPLICATE_IGNORED",
      message: "Event already processed.",
      data: emergencyEvents.get(packet_id)
    });
  }

  const sosRecord = {
    packet_id,
    sender_id: payload.sender_id,
    type: payload.type,
    priority: payload.priority || 'MEDIUM',
    timestamp: payload.timestamp || new Date().toISOString(),
    latitude: payload.latitude !== undefined ? payload.latitude : null,
    longitude: payload.longitude !== undefined ? payload.longitude : null,
    message: payload.message || '',
    status: 'ACTIVE',
    received_at: new Date().toISOString()
  };

  emergencyEvents.set(packet_id, sosRecord);

  return res.status(201).json({
    success: true,
    status: "CREATED",
    data: sosRecord
  });
};

export const getAllEvents = (req, res) => {
  const events = Array.from(emergencyEvents.values());
  return res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
};

export const updateEventStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!emergencyEvents.has(id)) {
    return res.status(404).json({ success: false, error: "Event not found" });
  }

  const event = emergencyEvents.get(id);
  event.status = status || event.status;
  emergencyEvents.set(id, event);

  return res.status(200).json({ success: true, data: event });
};