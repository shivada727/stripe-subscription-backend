import dotenv from 'dotenv';
import express from 'express';
import members from './routes/members';
import webhooks from './routes/webhooks';
import households from './routes/households';
import householdsQuery from './routes/householdQuery';
import { DataBaseConnection } from './services/DataBaseConnectionService';

const PORT = Number(process.env.PORT);

dotenv.config();

export const app = express();

app.use('/webhooks', webhooks);
app.use(express.json());
app.use(households);
app.use(members);
app.use(householdsQuery);

app.get('/health', (_request, response) => {
    response.json({ ok: true, ts: new Date().toISOString() });
});

export const dataBaseConnection = new DataBaseConnection();
dataBaseConnection.connectMongodb();

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
