import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Ready to send SOS");
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Not checked");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("GPS not supported");
      return;
    }

    setLocationStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        setLocationStatus("Location available");
      },
      () => {
        setLocationStatus("Location unavailable");
      }
    );
  };

  const sendSOS = () => {
    const packet = {
      packet_id: "SOS-" + Date.now(),
      sender_id: "KAVACH-USER-001",
      type: "EMERGENCY",
      priority: "HIGH",
      timestamp: new Date().toISOString(),
      latitude: location ? location.latitude : null,
      longitude: location ? location.longitude : null,
      message: message,
    };

    console.log("SOS Packet:", packet);

    setStatus("SOS packet created successfully");
  };

  return (
    <div className="app">
      <h1>🚨 KavachLink</h1>

      <p>Off-Grid Emergency SOS System</p>

      <div className="status">
        <p>📡 ESP32: Not Connected</p>
        <p>📍 Location: {locationStatus}</p>

        {location && (
          <p>
            Latitude: {location.latitude.toFixed(6)}
            <br />
            Longitude: {location.longitude.toFixed(6)}
          </p>
        )}
      </div>

      <button onClick={getLocation}>
        📍 Get My Location
      </button>

      <br />
      <br />

      <textarea
        placeholder="Enter emergency message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br />
      <br />

      <button className="sos-button" onClick={sendSOS}>
        🚨 SEND SOS
      </button>

      <p>{status}</p>
    </div>
  );
}

export default App;