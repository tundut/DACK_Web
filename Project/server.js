const http = require('http');
const handleRequest = require('./routes/handleRequest.js'); // Import file định tuyến

const server = http.createServer(handleRequest);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
