import SecurityService from '../../security';
import query from './query'; //Modify this line once you renamed your query file

query.expose({
  firewall(userId) {},
});
