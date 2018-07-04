import React from 'react';
import InterestRatesTable from 'core/components/InterestRatesTable';

import { columnOptions, rows } from './wwwInterestsTableHelpers';

const WwwInterestRatesTable = props => (
  <InterestRatesTable {...props} columnOptions={columnOptions} rows={rows} />
);

export default WwwInterestRatesTable;
// These are the 2 different implementations I mentioned
// during the dailly call. Which is better?
//
// import InterestRatesTable from 'core/components/InterestRatesTable';
// import WwwInterestRatesTableContainer from './WwwInterestRatesTableContainer.jsx';

// export default WwwInterestRatesTableContainer(InterestRatesTable);
