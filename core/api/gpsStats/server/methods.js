import { getGpsStats } from '../methodDefinitions';
import { getStats } from './gpsStats';

getGpsStats.setHandler((context, params) => getStats());
