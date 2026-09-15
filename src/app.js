import express from 'express';
import cors from 'cors'; 
import sosRoutes from './routes/sosRoutes.js';

const app = express();


app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.use('/', sosRoutes);


app.get('/', (req, res) => {
    res.status(200).json({ status: 'ONLINE', system: 'KavachLink CS2 Backend Ingestion API' });
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Shubham's Backend running on http://localhost:${PORT}`);
});
export default app;