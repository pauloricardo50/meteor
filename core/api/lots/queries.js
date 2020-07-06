import { lots as lotsFragment } from '../fragments';
import { LOT_QUERIES } from './lotConstants';
import Lots from '.';

export const lots = Lots.createQuery(LOT_QUERIES.LOTS, lotsFragment());
