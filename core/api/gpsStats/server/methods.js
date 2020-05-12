import {
  getCitiesFromZipCode as getCitiesFromZipCodeMethod,
  getGpsStats,
} from '../methodDefinitions';
import { getCitiesFromZipCode, getStats } from './gpsStats';

getGpsStats.setHandler((context, params) => getStats(params));
getCitiesFromZipCodeMethod.setHandler((context, params) =>
  getCitiesFromZipCode(params),
);
