export const validateSosPayload = (req, res, next) => {
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

  // 1. Mandatory Field Presence Validation
  if (
    !packet_id || 
    !device_id || 
    !emergency_type || 
    !priority || 
    !timestamp || 
    !message || 
    latitude === undefined || 
    longitude === undefined
  ) {
    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: "Missing required fields in SOS payload (packet_id, device_id, emergency_type, priority, timestamp, latitude, longitude, message)."
    });
  }

  // 2. Range and Type Validation
  const latNum = Number(latitude);
  const lonNum = Number(longitude);

  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    return res.status(400).json({ 
      success: false, 
      error: "INVALID_LATITUDE", 
      message: "Latitude must be a valid number between -90 and 90." 
    });
  }

  if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
    return res.status(400).json({ 
      success: false, 
      error: "INVALID_LONGITUDE", 
      message: "Longitude must be a valid number between -180 and 180." 
    });
  }

  if (isNaN(Date.parse(timestamp))) {
    return res.status(400).json({ 
      success: false, 
      error: "INVALID_TIMESTAMP", 
      message: "Timestamp must be a valid ISO Date/Timestamp string." 
    });
  }

  next();
};