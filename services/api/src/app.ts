import express from 'express';
import cors from 'cors';
import { APP_VERSION } from '@voteready/shared';
import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "VoteReady India API Ready",
    version: APP_VERSION
  });
});

// API Routes
app.use('/', routes);

export default app;
