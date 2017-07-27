import td from 'testdouble';

const Meteor = td.object(['methods', 'call']);
td.replace('meteor/meteor', { Meteor });
