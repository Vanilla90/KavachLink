import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

const port = new SerialPort({ path: 'COM15', baudRate: 115200 }); 
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

console.log("📡 Listening to Ayush's ESP32 Gateway via USB...");

parser.on('data', async (line) => {
    console.log("Raw Data from Hardware:", line);
    try {
        const loraPacket = JSON.parse(line);
        
        const response = await fetch('http://localhost:5000/api/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loraPacket)
        });
        
        console.log("✅ Successfully Forwarded to CS2 Backend! Status:", response.status);
    } catch (err) {
        console.error("⚠️ Error (Not a valid JSON or Server Down):", err.message);
    }
});