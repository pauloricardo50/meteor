// This is SSR, so also initialize here as well as on the client
import 'core/api/initialization';

import '../shared/setup';

import 'core/api/server';
import 'core/fixtures';
import './ssr-server';
import './kadira';
