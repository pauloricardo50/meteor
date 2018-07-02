import InterestRatesTable from 'core/components/InterestsTable';

import { columnOptions, rows } from './wwwInterestsTableHelpers';

export default ({ columnOptions, rows }) => (
  <InterestRatesTable columnOptions={columnOptions} rows={rows} />
);
