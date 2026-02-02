// Simple event emitter for auth events
const listeners = new Set();

export const subscribeAuth = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const emitAuth = (event, payload) => {
  listeners.forEach((cb) => {
    try {
      cb(event, payload);
    } catch (e) {
      console.error('authEvents handler error', e);
    }
  });
};

export default { subscribeAuth, emitAuth };
