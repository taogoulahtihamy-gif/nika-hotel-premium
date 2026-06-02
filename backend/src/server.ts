import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { apiRouter } from './routes';
import { authService } from './services/auth';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

app.use('/api', apiRouter);
app.get('/', (_, res) => res.json({ name: 'NIKA HOTEL API', status: 'online' }));

authService.seedAdmin().then(() => {
  console.log('Admin account seeded');
});

app.listen(PORT, () => console.log(`NIKA HOTEL API running on port ${PORT}`));
