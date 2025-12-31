import express from 'express';
import cors from 'cors';
import deliveriesRouter from './routes/deliveries';
import driversRouter from './routes/drivers';
import routesRouter from './routes/routes';

app.use('/routes', routesRouter);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/deliveries', deliveriesRouter);
app.use('/drivers', driversRouter);

export default app;
