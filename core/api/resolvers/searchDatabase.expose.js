import borrowerSearch from '../borrowers/queries/borrowerSearch';
import loanSearch from '../loans/queries/loanSearch';
import propertySearch from '../properties/queries/propertySearch';
import userSearch from '../users/queries/userSearch';
import searchDatabase from './searchDatabase';
import promotionSearch from '../promotions/queries/promotionSearch';

searchDatabase.expose();

searchDatabase.resolve(({ searchQuery }) => {
  const loans = loanSearch.clone({ searchQuery }).fetch();
  const properties = propertySearch.clone({ searchQuery }).fetch();
  const borrowers = borrowerSearch.clone({ searchQuery }).fetch();
  const users = userSearch.clone({ searchQuery }).fetch();
  const promotions = promotionSearch.clone({ searchQuery }).fetch();

  return [{ users }, { loans }, { borrowers }, { properties }, { promotions }];
});
