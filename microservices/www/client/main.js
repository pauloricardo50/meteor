import '../imports/startup/client';
import { Reload } from 'meteor/reload';

Reload._onMigrate(() => [false]);
