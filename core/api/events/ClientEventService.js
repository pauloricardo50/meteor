import { EventEmitter } from 'events';
import { EventService } from './EventService';

export default new EventService({ emmitter: new EventEmitter() });
