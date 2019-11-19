import InterestRatesTable from 'core/components/InterestRatesTable';
import WwwInterestRatesTableContainer, {
  WwwInterestsTableContainerForTests,
} from './WwwInterestRatesTableContainer.jsx';

export default WwwInterestRatesTableContainer(InterestRatesTable);

export const WwwInterestRatesTableForTests = WwwInterestsTableContainerForTests(
  InterestRatesTable,
);
