import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRouter } from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api', apiRouter);
app.get('/', (_, res) => res.json({ name: 'NIKA HOTEL API', status: 'online' }));

app.listen(PORT, () => console.log(`NIKA HOTEL API running on port ${PORT}`));
