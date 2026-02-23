const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // In production, this should be restricted
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-project', (projectId) => {
            socket.join(`project-${projectId}`);
            console.log(`User ${socket.id} joined project: ${projectId}`);
        });

        socket.on('leave-project', (projectId) => {
            socket.leave(`project-${projectId}`);
            console.log(`User ${socket.id} left project: ${projectId}`);
        });

        socket.on('task-moved', (data) => {
            const { projectId, taskId, newStatus, newTasks } = data;
            socket.to(`project-${projectId}`).emit('task-updated', { taskId, newStatus, newTasks });
            console.log(`Task ${taskId} moved in project ${projectId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { initSocket, getIO };
