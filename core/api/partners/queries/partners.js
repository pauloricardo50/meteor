import Partners from '../partners';
import { partnerFragment } from './partnersFragments';
import { PARTNERS_QUERIES } from '../partnersConstants';

export default Partners.createQuery(PARTNERS_QUERIES.PARTNERS, {
  ...partnerFragment,
});
