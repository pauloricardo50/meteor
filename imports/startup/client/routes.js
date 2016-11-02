import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { Accounts } from 'meteor/accounts-base';

import React from 'react';
import { mount } from 'react-mounter';

// import { AdminLayout } from '/imports/ui/layouts/AdminLayout.jsx';
import HomeLayout from '/imports/ui/layouts/HomeLayout.jsx';
import UserLayout from '/imports/ui/layouts/UserLayout.jsx';

// import '/imports/ui/pages.js';

import HomePage from '/imports/ui/containers/public/HomePageContainer.jsx';
import StartPage from '/imports/ui/pages/public/StartPage.jsx';
import LoginPage from '/imports/ui/pages/public/LoginPage.jsx';
import NewPage from '/imports/ui/pages/user/NewPage.jsx';
import MainPage from '/imports/ui/containers/user/MainPageContainer.jsx';
import ProfilePage from '/imports/ui/containers/user/ProfilePageContainer.jsx';
import TodoPage from '/imports/ui/containers/user/TodoPageContainer.jsx';
import DoPage from '/imports/ui/containers/user/DoPageContainer.jsx';
import { Step1Page, Step2Page, Step3Page, Step4Page, Step5Page }
  from '/imports/ui/containers/user/StepPageContainer.jsx';

// Extra components
import RequestProgressBar from '/imports/ui/containers/user/RequestProgressBarContainer.jsx';

// MUI Theme, replace lightBaseTheme with a custom theme ASAP!
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const theme = lightBaseTheme;

// This is recommended to be done in the template files
// Automatically redirect a user who logged in to his page
if (Meteor.isClient) {
  Accounts.onLogin(() => {
    FlowRouter.go('Main');
  });

  // Automatically redirect a user who logged out to the home page
  Accounts.onLogout(() => {
    FlowRouter.go('Home');
  });
}


// Public Routes
FlowRouter.route('/', {
  name: 'Home',
  action() {
    mount(HomePage);
  },
});

FlowRouter.route('/login', {
  name: 'Login',
  action() {
    mount(LoginPage);
  },
});

FlowRouter.route('/start', {
  name: 'Start',
  action() {
    mount(StartPage);
  },
});


// User Routes
FlowRouter.route('/main', {
  name: 'Main',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <MainPage />
        </MuiThemeProvider>,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/new', {
  name: 'New',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <NewPage />
        </MuiThemeProvider>,
    });
  },
});

FlowRouter.route('/step1', {
  name: 'Step1',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Step1Page />
        </MuiThemeProvider>,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step2', {
  name: 'Step2',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Step2Page />
        </MuiThemeProvider>,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step3', {
  name: 'Step3',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Step3Page />
        </MuiThemeProvider>,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step4', {
  name: 'Step4',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Step4Page />
        </MuiThemeProvider>,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step5', {
  name: 'Step5',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Step5Page />
        </MuiThemeProvider>,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/step1/:cardId', {
  name: 'Do',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <DoPage />
        </MuiThemeProvider>,
      extraContent: <RequestProgressBar />,
    });
  },
});


FlowRouter.route('/profile', {
  name: 'Profile',
  action() {
    mount(UserLayout, {
      content:
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <ProfilePage />
        </MuiThemeProvider>,
      extraContent: <RequestProgressBar />,
    });
  },
});

FlowRouter.route('/:id/todo', {
  name: 'Todo',
  action() {
    mount(UserLayout, {
      content: <TodoPage />,
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
