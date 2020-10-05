import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React from 'react';

import { USERS_COLLECTION } from 'core/api/users/userConstants';
import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import { getFormats, getUserLocale } from 'core/utils/localization';

import messagesFR from '../../../lang/fr.json';
import AdminLayout from '../../client/layouts/AdminLayout';
import ADMIN_ROUTES from './adminRoutes';

const isDev = Meteor.isDevelopment;

const AdminRoutes = props => (
  <Switch>
    {Object.keys(ADMIN_ROUTES).map(route => (
      <Route {...ADMIN_ROUTES[route]} {...props} key={route} />
    ))}
  </Switch>
);

const AdminRouter = () => {
  const { userId } = useTracker(() => ({ userId: Meteor.userId() }), []);

  return (
    <BaseRouter
      locale={getUserLocale()}
      messages={isDev ? {} : messagesFR}
      formats={getFormats()}
      routes={ADMIN_ROUTES}
      currentUserConfig={{
        query: userId && USERS_COLLECTION,
        params: {
          $filters: { _id: userId },
          email: 1,
          emails: 1,
          name: 1,
          organisations: { name: 1 },
          roles: 1,
          defaultBoardId: 1,
        },
        deps: [userId],
      }}
    >
      <AdminLayout type="admin">
        <AdminRoutes />
      </AdminLayout>
    </BaseRouter>
  );
};

export default AdminRouter;
