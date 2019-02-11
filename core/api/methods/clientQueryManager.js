import { Meteor } from 'meteor/meteor';
import ClientEventService from '../events/ClientEventService';

const isActive = () => !!global.window;

const init = () => {
  if (isActive()) {
    window.activeQueries = {};
  }
};

init();

const addQuery = (queryName, type) => {
  // Add support for passing method config objects
  if (typeof type === 'object') {
    window.activeQueries[type.config.name] = [
      ...(window.activeQueries[type.config.name] || []),
      queryName,
    ];
  } else {
    window.activeQueries[type] = [
      ...(window.activeQueries[type] || []),
      queryName,
    ];
  }
};

export const addQueryToRefetch = (queryName, type) => {
  if (isActive()) {
    if (!type) {
      return;
    }

    if (Array.isArray(type)) {
      type.forEach((t) => {
        addQuery(queryName, t);
      });
    } else {
      addQuery(queryName, type);
    }
  }
};

export const removeQueryToRefetch = (queryName) => {
  if (isActive()) {
    Object.keys(window.activeQueries).forEach((type) => {
      if (Array.isArray(window.activeQueries[type])) {
        window.activeQueries[type] = window.activeQueries[type].filter(query => query !== queryName);

        // Clean up this particular refetch key if there is no query in it anymore
        if (window.activeQueries[type].length === 0) {
          window.activeQueries[type] = undefined;
        }
      }
    });
  }
};

export const refetchQuery = query => ClientEventService.emit(query);

export const refetchQueries = (methodName) => {
  if (isActive()) {
    if (window.activeQueries.all) {
      window.activeQueries.all.forEach(refetchQuery);
    }

    if (window.activeQueries[methodName]) {
      window.activeQueries[methodName].forEach(refetchQuery);
    }
  }
};

if (Meteor.isAppTest && global.window) {
  global.window.refetchQueries = refetchQueries;
}
