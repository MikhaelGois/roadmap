import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import http from 'http';
import { initSocket } from './socket';

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
