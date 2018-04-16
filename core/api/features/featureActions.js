import { TOGGLE_POINTS } from './featureConstants';

const { HOMEPAGE_LOGIN_BUTTON, STARTPAGE_CONTINUE_BUTTON } = TOGGLE_POINTS;

const configureTogglePoint = ({ hide = false, props = {} }) => ({
  hide,
  props,
});

// when the an action runs, it configures the toggle points it needs
const featureActions = {
  SHOW_MOBILE_HOMEPAGE: () => ({
    [HOMEPAGE_LOGIN_BUTTON]: configureTogglePoint({ hide: true }),
    [STARTPAGE_CONTINUE_BUTTON]: configureTogglePoint({
      props: { color: 'red' },
    }),
  }),
};

export const runFeatureAction = actionName => featureActions[actionName]();
