import { withProps } from 'recompose';
import { createSearchFilters } from '../../../core/api/helpers';
import EpotekFrontApi from '../../../EpotekFrontApi';

const fetchLoans = ({ searchQuery }) =>
  EpotekFrontApi.query('loans', {
    $filters: createSearchFilters(
      [
        'name',
        '_id',
        'customName',
        'userCache.firstName',
        'userCache.lastName',
      ],
      searchQuery,
    ),
    name: 1,
    status: 1,
    category: 1,
    borrowers: { name: 1 },
    user: { name: 1, firstName: 1, lastName: 1 },
    $options: { limit: 5 },
  });

export default withProps(() => ({
  fetchLoans,
}));
