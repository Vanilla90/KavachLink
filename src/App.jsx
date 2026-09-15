import { useEffect, useRef, useState } from "react";

const NODE_A_URL = "http://192.168.4.1";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Ready to send SOS");
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("Not checked");
  const [espStatus, setEspStatus] = useState("Not connected");
  const [packet, setPacket] = useState(null);

  const pollingRef = useRef(null);

  // Get phone location
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

        setLocation({ latitude, longitude });
        setLocationStatus("Location available");
      },
      () => {
        setLocationStatus("Location unavailable");
      }
    );
  };

  // Stop status polling
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // Check delivery status from Node A
  const startPolling = (packetId) => {
    stopPolling();

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `${NODE_A_URL}/sos/status?packet_id=${encodeURIComponent(packetId)}`
        );

        if (!response.ok) {
          throw new Error("Status request failed");
        }

        const data = await response.json();

        console.log("SOS Status:", data);

        if (data.status === "delivered") {
          setStatus("SOS delivered successfully ✅");
          setEspStatus("Connected");
          stopPolling();
        } else if (data.status === "delivery_unconfirmed") {
          setStatus("SOS delivery could not be confirmed ⚠️");
          setEspStatus("Connected");
          stopPolling();
        } else if (data.status === "processing") {
          setStatus("Delivery in progress... ⏳");
        }
      } catch (error) {
        console.error("Status error:", error);
        setStatus("Unable to check delivery status");
        stopPolling();
      }
    };

    // Check immediately
    checkStatus();

    // Then check approximately every 1 second
    pollingRef.current = setInterval(checkStatus, 1000);
  };

  // Send SOS to ESP32 Node A
  const sendSOS = async () => {
    stopPolling();

    const packetId =
      "SOS-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 8);

    const newPacket = {
      packet_id: packetId,
      sender_id: "KAVACH-USER-001",
      type: "SOS",
      priority: "HIGH",
      timestamp: Math.floor(Date.now() / 1000),
      latitude: location ? location.latitude : null,
      longitude: location ? location.longitude : null,
      message: message,
    };

    setPacket(newPacket);
    setStatus("Sending SOS to ESP32...");
    setEspStatus("Connecting...");

    console.log("SOS Packet:", newPacket);

    try {
      const response = await fetch(`${NODE_A_URL}/sos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPacket),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Node A Response:", data);

      if (
        data.status === "accepted" &&
        data.packet_id === newPacket.packet_id
      ) {
        setEspStatus("Connected");
        setStatus("SOS accepted by Node A. Delivery in progress... ⏳");

        startPolling(newPacket.packet_id);
      } else {
        setStatus("Unexpected response from Node A");
      }
    } catch (error) {
      console.error("SOS sending error:", error);

      setEspStatus("Connection failed");
      setStatus(
        "Could not connect to ESP32. Connect to RESCUNET_NODE_A Wi-Fi and try again."
      );
    }
  };

  // Stop polling when component is removed
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return (
    <div className="app">
      <h1>🚨 KavachLink</h1>
      <p>Off-Grid Emergency SOS System</p>

      <div className="status">
        <p>📡 ESP32: {espStatus}</p>
        <p>📍 Location: {locationStatus}</p>

        {location && (
          <p>
            Latitude: {location.latitude.toFixed(6)}
            <br />
            Longitude: {location.longitude.toFixed(6)}
          </p>
        )}
      </div>

      <button onClick={getLocation}>📍 Get My Location</button>

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

      {packet && (
        <div>
          <h3>Latest SOS Packet</h3>
          <p>Packet ID: {packet.packet_id}</p>
          <p>Type: {packet.type}</p>
          <p>Priority: {packet.priority}</p>
          <p>Timestamp: {packet.timestamp}</p>
        </div>
      )}
    </div>
  );
}

export default App;