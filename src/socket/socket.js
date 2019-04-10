import Socket from 'socket.io';
import engine from 'engine.io';
import authenticator from '../helpers/authenticator';

const io = new Socket();

const ioOptions = {
  path: '/api/v1/socket/notifications'
};

engine.Server.prototype.generateId = (req) => {
  const query = '_query';
  try {
    return authenticator.verifyToken(req[query].authorization).id;
  } catch (error) {
    return null;
  }
};

io.use((socket, next) => {
  if (!socket.id) {
    return next(new Error('Not authorized'));
  }
  next();
});

export { io, ioOptions };
