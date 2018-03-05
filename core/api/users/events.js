import EventEmitter from 'event-emitter';

const Emitter = new EventEmitter();
const Events = {
  USER_CREATED: 'user_created',
};
export { Emitter, Events };
