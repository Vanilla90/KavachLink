import { emergencyEvents } from '../config/db.js';

export const handleSosIngestion = (req, res) => {
  const { 
    packet_id, 
    device_id, 
    emergency_type, 
    priority, 
    timestamp, 
    latitude, 
    longitude, 
    message 
  } = req.body;

  // O(1) Deduplication Check using Mandatory packet_id
  if (emergencyEvents.has(packet_id)) {
    return res.status(200).json({
      success: true,
      status: "DUPLICATE_IGNORED",
      message: "Packet already processed by backend."
    });
  }

  const eventData = {
    id: packet_id,
    packet_id,
    device_id,
    emergency_type,
    priority,
    message,
    location: {
      latitude: Number(latitude),
      longitude: Number(longitude)
    },
    status: 'ACTIVE',
    received_at: timestamp
  };

  emergencyEvents.set(packet_id, eventData);

  return res.status(201).json({
    success: true,
    status: "CREATED",
    data: eventData
  });
};

export const getActiveEvents = (req, res) => {
  const eventsList = Array.from(emergencyEvents.values());
  return res.status(200).json({
    success: true,
    count: eventsList.length,
    data: eventsList
  });
};

export const updateEventStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ALLOWED_STATUSES = ['ACTIVE', 'IN_PROGRESS', 'RESOLVED'];

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "INVALID_STATUS",
      message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`
    });
  }

  if (!emergencyEvents.has(id)) {
    return res.status(404).json({
      success: false,
      error: "NOT_FOUND",
      message: "Event ID not found."
    });
  }

  const existingEvent = emergencyEvents.get(id);
  existingEvent.status = status;
  emergencyEvents.set(id, existingEvent);

  return res.status(200).json({
    success: true,
    data: existingEvent
  });
};