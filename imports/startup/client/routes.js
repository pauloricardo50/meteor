import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import React from 'react';
import { mount } from 'react-mounter';

// layouts
import PublicLayout from '/imports/ui/layouts/PublicLayout.jsx';
import UserLayout from '/imports/ui/layouts/UserLayout.jsx';

// Pages and top-level components
import HomePage from '/imports/ui/containers/public/HomePageContainer.jsx';
import StartPage from '/imports/ui/pages/public/StartPage.jsx';
import LoginPage from '/imports/ui/pages/public/LoginPage.jsx';
import NewPage from '/imports/ui/pages/user/NewPage.jsx';

import {
  MainPage, DoPage, FinancePage, ContactPage,
  Step1Page, Step2Page, Step3Page, Step4Page, Step5Page,
  // RequestProgressBar,
} from '/imports/ui/containers/user/ActiveRequestContainer.jsx';

import { RequestProgressBar } from '/imports/ui/containers/user/CurrentURLContainer.jsx';

import SettingsPage from '/imports/ui/containers/user/SettingsPageContainer.jsx';


// Automatically route someone who logs out to the homepage
if (Meteor.isClient) {
  Accounts.onLogout(function () {
    FlowRouter.go('/');
  });
}


// Public Routes
FlowRouter.route('/', {
  name: 'Home',
  action() {
    mount(PublicLayout, {
      content:
        <HomePage />,
    });
  },
});

FlowRouter.route('/login', {
  name: 'Login',
  action() {
    mount(PublicLayout, {
      content:
        <LoginPage />,
    });
  },
});

FlowRouter.route('/start', {
  name: 'Start',
  action() {
    mount(PublicLayout, {
      content:
        <StartPage />,
    });
  },
});


// User Routes
FlowRouter.route('/main', {
  name: 'Main',
  action() {
    mount(UserLayout, {
      content:
        <MainPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/new', {
  name: 'New',
  action() {
    mount(UserLayout, {
      content:
        <NewPage />,
    });
  },
});

FlowRouter.route('/step1', {
  name: 'Step1',
  action() {
    mount(UserLayout, {
      content:
        <Step1Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step2', {
  name: 'Step2',
  action() {
    mount(UserLayout, {
      content:
        <Step2Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step3', {
  name: 'Step3',
  action() {
    mount(UserLayout, {
      content:
        <Step3Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step4', {
  name: 'Step4',
  action() {
    mount(UserLayout, {
      content:
        <Step4Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step5', {
  name: 'Step5',
  action() {
    mount(UserLayout, {
      content:
        <Step5Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step1/:cardId', {
  name: 'Do',
  action() {
    mount(UserLayout, {
      content:
        <DoPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});


FlowRouter.route('/settings', {
  name: 'Settings',
  action() {
    mount(UserLayout, {
      content:
        <SettingsPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/contact', {
  name: 'Contact',
  action() {
    mount(UserLayout, {
      content:
        <ContactPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/finance', {
  name: 'Finance',
  action() {
    mount(UserLayout, {
      content:
        <FinancePage />,
      extraContent: <RequestProgressBar />,
    });
  },
});


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
