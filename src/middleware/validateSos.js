export const validateSosPayload = (req, res, next) => {
  const { packet_id, sender_id, type, priority } = req.body;

  if (!packet_id || !sender_id || !type || !priority) {
    return res.status(400).json({
      success: false,
      error: "Bad Request: Missing required fields (packet_id, sender_id, type, priority)."
    });
  }

  next();
};