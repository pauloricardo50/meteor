import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';

import React from 'react';
import { mount } from 'react-mounter';

// import { AdminLayout } from '/imports/ui/layouts/AdminLayout.jsx';
import HomeLayout from '/imports/ui/layouts/HomeLayout.jsx';
import UserLayout from '/imports/ui/layouts/UserLayout.jsx';

// import '/imports/ui/pages.js';

import HomePage from '/imports/ui/containers/public/HomePageContainer.jsx';
import MainPage from '/imports/ui/containers/user/MainPageContainer.jsx';
import TodoPage from '/imports/ui/containers/user/TodoPageContainer.jsx';
import DoPage from '/imports/ui/containers/user/DoPageContainer.jsx';

// Extra components
import RequestProgressBar from '/imports/ui/components/general/RequestProgressBar.jsx';



// This is recommended to be done in the template files
// Automatically redirect a user who logged in to his page
// if (Meteor.isClient) {
//   Accounts.onLogin(() => {
//     FlowRouter.go('Main');
//   });
//
//   // Automatically redirect a user who logged out to the home page
//   Accounts.onLogout(() => {
//     FlowRouter.go('Home');
//   });
// }


// Public Routes
FlowRouter.route('/', {
  name: 'Home',
  action() {
    mount(HomePage);
  },
});

// FlowRouter.route('/start', {
//   name: 'Start',
//   action() {
//     mount(HomeLayout, {
//       content: <StartPage />,
//     });
//   },
// });
//
//
// User Routes
FlowRouter.route('/main', {
  name: 'Main',
  action() {
    mount(UserLayout, {
      content: <MainPage />,
    });
  },
});
//
//
// FlowRouter.route('/profile', {
//   name: 'Profile',
//   action() {
//     mount(UserLayout, {
//       content: <ProfilePage />,
//     });
//   },
// });
//
//
FlowRouter.route('/:id/todo', {
  name: 'Todo',
  action() {
    mount(UserLayout, {
      content: <TodoPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/:id/todo/:cardId', {
  name: 'Do',
  action() {
    mount(UserLayout, {
      content: <DoPage />,
    });
  },
});
//
//
// // Admin routes
// const adminRoutes = FlowRouter.group({
//   prefix: '/admin',
//   name: 'Admin',
// });
//
//
// adminRoutes.route('/requests', {
//   name: 'AdminRequests',
//   action() {
//     mount(AdminLayout, {
//       content: <AdminRequestsPage />,
//     });
//   },
// });
//
//
// adminRoutes.route('/requests/:id', {
//   name: 'AdminSingleRequest',
//   action() {
//     mount(AdminLayout, {
//       content: <AdminSingleRequestPage />,
//     });
//   },
// });
//
//
// adminRoutes.route('/users', {
//   name: 'AdminUsers',
//   action() {
//     mount(AdminLayout, {
//       content: <AdminUsersPage />,
//     });
//   },
// });
//
//
// adminRoutes.route('/users/:id', {
//   name: 'AdminSingleRequest',
//   action() {
//     mount(AdminLayout, {
//       content: <AdminSingleUserPage />,
//     });
//   },
// });
//
//
// // Partner routes
// FlowRouter.route('/requests/:id/partnerform', {
//   name: 'partnerForm',
//   action() {
//     mount(AdminLayout, {
//       content: <PartnerFormPage />,
//     });
//   },
// });
