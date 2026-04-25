import express from 'express';
import cors from 'cors';
import { APP_VERSION, HealthResponse } from '@voteready/shared';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: "VoteReady India API Shell Ready",
    version: APP_VERSION
  });
});

app.get('/health', (req, res) => {
  const health: HealthResponse = {
    ok: true,
    service: "voteready-api",
    version: APP_VERSION,
    timestamp: new Date().toISOString()
  };
  res.json(health);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
