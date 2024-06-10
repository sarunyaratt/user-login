import http from 'http';
import app from './app';

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

if (!port) {
    throw new Error('PORT or API_PORT environment variable is not defined');
}

// server listening
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
