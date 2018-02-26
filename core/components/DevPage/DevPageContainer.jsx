import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Users, Loans, Borrowers, Properties, Tasks, Offers } from 'core/api';
import DevPage from './DevPage';

const DevPageContainer = withTracker(() => {
  const loansHandle = Meteor.subscribe('allLoans');
  const tasksHandle = Meteor.subscribe('allTasks');
  const borrowersHandle = Meteor.subscribe('allBorrowers');
  const propertiesHandle = Meteor.subscribe('allProperties');
  const offersHandle = Meteor.subscribe('allOffers');
  const usersHandle = Meteor.subscribe('allUsers');

  const loading =
    !loansHandle.ready() ||
    !tasksHandle.ready() ||
    !borrowersHandle.ready() ||
    !propertiesHandle.ready() ||
    !offersHandle.ready() ||
    !usersHandle.ready();

  const loans = Loans.find().fetch();
  const tasks = Tasks.find().fetch();
  const offers = Offers.find().fetch();
  const borrowers = Borrowers.find().fetch();
  const properties = Properties.find().fetch();
  const users = Users.find().fetch();

  return {
    loading,
    loans,
    properties,
    tasks,
    borrowers,
    offers,
    users,
  };
})(DevPage);

export default DevPageContainer;
