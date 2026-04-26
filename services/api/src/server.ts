import express from 'express';
import cors from 'cors';
import { APP_VERSION } from '@voteready/shared';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 8080;

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

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

