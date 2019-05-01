import '../testInit.test';

import { resetDatabase } from 'meteor/xolvio:cleaner';

// this imports everything needed on the server
import '../../api';
import '../../api/api-server';

Kadira.connect('jw3K49AvCwjNSb7fA', '76bf4219-6428-438d-99b9-090ce98b373a', {
  endpoint: 'https://kadira-engine.e-potek.ch:22022',
});

resetDatabase();
