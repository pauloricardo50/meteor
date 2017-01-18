import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import React from 'react';
import { mount } from 'react-mounter';


// layouts
import PublicLayout from '/imports/ui/layouts/PublicLayout.jsx';
import { UserLayout, AdminLayout, PartnerLayout } from '/imports/ui/containers/public/CurrentUserContainer';


// Public Pages
import HomePage from '/imports/ui/containers/public/HomePageContainer.js';
import StartPage from '/imports/ui/pages/public/StartPage.jsx';
import LoginPage from '/imports/ui/pages/public/LoginPage.jsx';

import DemoPage from '/imports/ui/pages/public/DemoPage.jsx';


// User Pages and components
import {
  MainPage, TodoCardPage, FinancePage, ContactPage,
  Step1Page, Step3Page, Step4Page, Step5Page, Step6Page,
} from '/imports/ui/containers/user/ActiveRequestContainer.js';
import NewPage from '/imports/ui/pages/user/NewPage.jsx';
import { RequestProgressBar } from '/imports/ui/containers/user/CurrentURLContainer.js';
import SettingsPage from '/imports/ui/containers/user/SettingsPageContainer.js';
import { Step2Page, StrategyPage } from '/imports/ui/containers/user/RequestAndOffersContainer.js';


// Partner Pages
import { PartnerHomePage } from '/imports/ui/containers/partner/PartnerRequestsContainer.js';
import { PartnerRequestPage } from '/imports/ui/containers/partner/PartnerSingleRequestContainer.js';


// Admin Pages
import { AdminHomePage } from '/imports/ui/containers/admin/AllCollectionsContainer';
import { AdminUsersPage } from '/imports/ui/containers/admin/AllUsersContainer';
import { AdminRequestsPage } from '/imports/ui/containers/admin/AllRequestsContainer';
import { AdminSingleRequestPage } from '/imports/ui/containers/admin/SingleRequestContainer';
import { AdminSingleUserPage } from '/imports/ui/containers/admin/SingleUserContainer'
import AdminActionsPage from '/imports/ui/pages/admin/AdminActionsPage.jsx';

// Automatically route someone who logs out to the homepage
if (Meteor.isClient) {
  Accounts.onLogout(function () {
    FlowRouter.go('/');
  });
}


// Public Routes
FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(PublicLayout, {
      content:
        <HomePage />,
    });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    mount(PublicLayout, {
      content:
        <LoginPage />,
    });
  },
});

FlowRouter.route('/start', {
  name: 'start',
  action() {
    mount(PublicLayout, {
      content:
        <StartPage />,
    });
  },
});

FlowRouter.route('/demo', {
  name: 'demo',
  action() {
    mount(PublicLayout, {
      content:
        <DemoPage />,
    });
  },
});


// User Routes
FlowRouter.route('/main', {
  name: 'main',
  action() {
    mount(UserLayout, {
      content:
        <MainPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/new', {
  name: 'new',
  action() {
    mount(UserLayout, {
      content:
        <NewPage />,
    });
  },
});

FlowRouter.route('/step1', {
  name: 'step1',
  action() {
    mount(UserLayout, {
      content:
        <Step1Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step2', {
  name: 'step2',
  action() {
    mount(UserLayout, {
      content:
        <Step2Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step3', {
  name: 'step3',
  action() {
    mount(UserLayout, {
      content:
        <Step3Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step4', {
  name: 'step4',
  action() {
    mount(UserLayout, {
      content:
        <Step4Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step5', {
  name: 'step5',
  action() {
    mount(UserLayout, {
      content:
        <Step5Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step6', {
  name: 'step6',
  action() {
    mount(UserLayout, {
      content:
        <Step6Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step3/:cardId', {
  name: 'todoCard2',
  action() {
    mount(UserLayout, {
      content:
        <TodoCardPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step5/:cardId', {
  name: 'todoCard3',
  action() {
    mount(UserLayout, {
      content:
        <TodoCardPage />,
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
  name: 'contact',
  action() {
    mount(UserLayout, {
      content:
        <ContactPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/finance', {
  name: 'finance',
  action() {
    mount(UserLayout, {
      content:
        <FinancePage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/finance/strategy', {
  name: 'strategy',
  action() {
    mount(UserLayout, {
      content:
        <StrategyPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});


// // Admin routes
const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'Admin',
});

adminRoutes.route('/', {
  name: 'AdminHome',
  action() {
    mount(AdminLayout, {
      content: <AdminHomePage />,
    });
  },
});


adminRoutes.route('/requests', {
  name: 'AdminRequests',
  action() {
    mount(AdminLayout, {
      content: <AdminRequestsPage />,
    });
  },
});


adminRoutes.route('/requests/:id', {
  name: 'AdminSingleRequest',
  action() {
    mount(AdminLayout, {
      content: <AdminSingleRequestPage />,
    });
  },
});


adminRoutes.route('/users', {
  name: 'AdminUsers',
  action() {
    mount(AdminLayout, {
      content: <AdminUsersPage />,
    });
  },
});


adminRoutes.route('/users/:id', {
  name: 'AdminSingleRequest',
  action() {
    mount(AdminLayout, {
      content: <AdminSingleUserPage />,
    });
  },
});


adminRoutes.route('/actions/:action', {
  name: 'AdminSingleRequest',
  action() {
    mount(AdminLayout, {
      content: <AdminActionsPage />,
    });
  },
});


// Partner routes
const partnerRoutes = FlowRouter.group({
  prefix: '/partner',
  name: 'partner',
});

partnerRoutes.route('/', {
  name: 'partnerHome',
  action() {
    mount(PartnerLayout, {
      content:
        <PartnerHomePage />,
    });
  },
});

partnerRoutes.route('/:requestId', {
  name: 'partnerRequestPage',
  action() {
    mount(PartnerLayout, {
      content:
        <PartnerRequestPage />,
    });
  },
});
