import { Meteor } from 'meteor/meteor';
import { CreditRequests } from '../creditrequests.js';

// Publish a specific creditRequest with an ID
Meteor.publish('creditRequest', function(id) {
	check(id, String);

	if (Roles.userIsInRole(this.userId, 'admin')) {
		return CreditRequests.find({
			_id: id
		});
	} else {
		return CreditRequests.find({
			_id: id
		}, {
			author: this.userId
		});
	}

	// Throw unauthorized error

});

// Publish the currently active creditrequest
Meteor.publish('activeCreditRequest', function() {

	// find or findOne? Since there should only be one at any time..?
	return CreditRequests.findOne({
		active: true
	}, {
		author: this.userId
	});
})

// Publish all creditrequests from the current user
Meteor.publish('creditRequests', function() {

	// Verify if user is logged In
	if (!this.userId) {
	    return this.ready();
	}

	return CreditRequests.find({
		author: this.userId
	});
});

// Publish all creditrequests in the database for admins
Meteor.publish('allCreditRequests', function() {

	// Verify if user is logged In
	if (Roles.userIsInRole(this.userId, 'admin')) {
        // Return all users
        return CreditRequests.find();
    } else {
        return [];
    }
});

// Publish the creditrequest with a specific ID, and only show the fields for an anonymous offer
Meteor.publish('partnerCreditRequest', function(id) {
	check(id, String);

	// TODO Verify something? or public?

	return CreditRequests.find({
		_id: id
	},
	{
		fields: {
			salary: 1,
			fortune: 1
			// add more!
		}
	});

});
