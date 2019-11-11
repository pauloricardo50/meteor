import { withState, compose, withProps } from 'recompose';
import { userSearch } from 'core/api/users/queries';

export default compose(
  withState('searchQuery', 'setSearchQuery', ''),
  withState('searchResults', 'setSearchResults', undefined),
  withProps(({ searchQuery, setSearchResults }) => ({
    onSearch: event => {
      event.preventDefault();
      userSearch.clone({ searchQuery }).fetch((err, users) => {
        if (err) {
          throw err;
        }
        setSearchResults(users);
      });
    },
  })),
);
