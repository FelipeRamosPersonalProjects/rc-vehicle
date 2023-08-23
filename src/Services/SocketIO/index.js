import { Server } from 'socket.io';
import SocketConnection from './SocketConnection.js';

export default class SocketIO {
    constructor (settings) {
        const {
            allowedOrigins,
            port,
            onConnected
        } = Object(settings);
        const origin = ['http://localhost', ...(allowedOrigins || [])];

        this.ioServer = new Server({ cors: { origin }});
        this.connections = {};

        this.ioServer.on('connect', (io) => {
            console.log('Socket connected!');

            this.connections.mainDriver = new SocketConnection(io);
            onConnected && onConnected(this.connections.mainDriver.connection);
        });

        this.ioServer.on('disconnect', (io) => {
            delete this.connections[io.id];
        });

        this.ioServer.listen(port || 5555);
    }
}
