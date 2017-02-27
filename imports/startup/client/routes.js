import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { mount } from 'react-mounter';


// layouts
import PublicLayout from '/imports/ui/layouts/PublicLayout.jsx';
import { UserLayout, AdminLayout, PartnerLayout } from '/imports/ui/containers/public/CurrentUserContainer';


// Public Pages
import HomePage from '/imports/ui/containers/public/HomePageContainer';
import StartPage from '/imports/ui/pages/public/StartPage.jsx';
import StartPage2 from '/imports/ui/pages/public/StartPage2.jsx';

import LoginPage from '/imports/ui/pages/public/LoginPage.jsx';

import DemoPage from '/imports/ui/pages/public/DemoPage.jsx';
import AboutPage from '/imports/ui/pages/public/AboutPage.jsx';
import CareersPage from '/imports/ui/pages/public/CareersPage.jsx';
import TosPage from '/imports/ui/pages/public/TosPage.jsx';


// User Pages and components
import {
  MainPage, TodoCardPage, FinancePage, ContactPage,
  Step1Page, Step3Page, Step4Page, Step5Page, Step6Page,
} from '/imports/ui/containers/user/ActiveRequestContainer';
import NewPage from '/imports/ui/pages/user/NewPage.jsx';
import { RequestProgressBar } from '/imports/ui/containers/user/CurrentURLContainer';
import SettingsPage from '/imports/ui/containers/user/SettingsPageContainer';
import { Step2Page, StrategyPage, StrategySinglePage } from '/imports/ui/containers/user/RequestAndOffersContainer';


// Partner Pages
import { PartnerHomePage } from '/imports/ui/containers/partner/PartnerRequestsContainer';
import { PartnerRequestPage } from '/imports/ui/containers/partner/PartnerSingleRequestContainer';


// Admin Pages
import { AdminHomePage } from '/imports/ui/containers/admin/AllCollectionsContainer';
import { AdminUsersPage } from '/imports/ui/containers/admin/AllUsersContainer';
import { AdminRequestsPage } from '/imports/ui/containers/admin/AllRequestsContainer';
import { AdminSingleRequestPage, AdminOfferPage } from '/imports/ui/containers/admin/SingleRequestContainer';
import { AdminSingleUserPage } from '/imports/ui/containers/admin/SingleUserContainer';
import AdminActionsPage from '/imports/ui/pages/admin/AdminActionsPage.jsx';

// Automatically route someone who logs out to the homepage
if (Meteor.isClient) {
  Accounts.onLogout(function () {
    FlowRouter.go('/');
  });
}


FlowRouter.triggers.exit((context) => {
  Session.set('lastRoute', { name: context.route.name, params: context.params });
});


// Public Routes
FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(PublicLayout, {
      content: <HomePage />,
    });
  },
});

FlowRouter.route('/about', {
  name: 'home',
  action() {
    mount(PublicLayout, {
      content: <AboutPage />,
    });
  },
});

FlowRouter.route('/careers', {
  name: 'careers',
  action() {
    mount(PublicLayout, {
      content: <CareersPage />,
    });
  },
});

FlowRouter.route('/tos', {
  name: 'tos',
  action() {
    mount(PublicLayout, {
      content: <TosPage />,
    });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    mount(PublicLayout, {
      content: <LoginPage />,
    });
  },
});

FlowRouter.route('/start', {
  name: 'start',
  action() {
    mount(PublicLayout, {
      content: <StartPage />,
    });
  },
});

FlowRouter.route('/start2', {
  name: 'start',
  action() {
    mount(PublicLayout, {
      content: <StartPage2 />,
    });
  },
});

FlowRouter.route('/demo', {
  name: 'demo',
  action() {
    mount(PublicLayout, {
      content: <DemoPage />,
    });
  },
});


// User Routes
FlowRouter.route('/main', {
  name: 'main',
  action() {
    mount(UserLayout, {
      content: <MainPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/new', {
  name: 'new',
  action() {
    mount(UserLayout, {
      content: <NewPage />,
      noNav: true,
    });
  },
});

FlowRouter.route('/step1', {
  name: 'step1',
  action() {
    mount(UserLayout, {
      content: <Step1Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step2', {
  name: 'step2',
  action() {
    mount(UserLayout, {
      content: <Step2Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step3', {
  name: 'step3',
  action() {
    mount(UserLayout, {
      content: <Step3Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step4', {
  name: 'step4',
  action() {
    mount(UserLayout, {
      content: <Step4Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step5', {
  name: 'step5',
  action() {
    mount(UserLayout, {
      content: <Step5Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step6', {
  name: 'step6',
  action() {
    mount(UserLayout, {
      content: <Step6Page />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step3/:cardId', {
  name: 'todoCard2',
  action() {
    mount(UserLayout, {
      content: <TodoCardPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step5/:cardId', {
  name: 'todoCard3',
  action() {
    mount(UserLayout, {
      content: <TodoCardPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});


FlowRouter.route('/settings', {
  name: 'Settings',
  action() {
    mount(UserLayout, {
      content: <SettingsPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/contact', {
  name: 'contact',
  action() {
    mount(UserLayout, {
      content: <ContactPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/finance', {
  name: 'finance',
  action() {
    mount(UserLayout, {
      content: <FinancePage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/strategy', {
  name: 'strategy',
  action() {
    mount(UserLayout, {
      content: <StrategyPage />,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/strategy/:id', {
  name: 'strategysingle',
  action() {
    mount(UserLayout, {
      content: <StrategySinglePage />,
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


adminRoutes.route('/requests/:id/offers/:offerId', {
  name: 'AdminSingleRequest',
  action() {
    mount(AdminLayout, {
      content: <AdminOfferPage />,
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
      content: <PartnerHomePage />,
    });
  },
});

partnerRoutes.route('/:requestId', {
  name: 'partnerRequestPage',
  action() {
    mount(PartnerLayout, {
      content: <PartnerRequestPage />,
    });
  },
});
