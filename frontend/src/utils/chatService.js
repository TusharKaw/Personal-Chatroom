import { io } from 'socket.io-client';

let socket;

export const initializeSocket = () => {
  socket = io('http://localhost:5000', {
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Connected to socket server:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const joinChannel = (channelId) => {
  const socketInstance = getSocket();
  socketInstance.emit('join_channel', channelId);
};

export const leaveChannel = (channelId) => {
  const socketInstance = getSocket();
  socketInstance.emit('leave_channel', channelId);
};

export const sendMessage = (messageData) => {
  const socketInstance = getSocket();
  socketInstance.emit('send_message', messageData);
};

export const subscribeToMessages = (callback) => {
  const socketInstance = getSocket();
  socketInstance.on('receive_message', (message) => {
    callback(message);
  });
};

export const unsubscribeFromMessages = () => {
  const socketInstance = getSocket();
  socketInstance.off('receive_message');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
}; 