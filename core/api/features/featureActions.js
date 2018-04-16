import { TOGGLE_POINTS } from './featureConstants';

const { WIDGET1_CONTINUE_BUTTON } = TOGGLE_POINTS;

const configureTogglePoint = ({ hide = false, props = {} }) => ({
  hide,
  props,
});

// when the an action runs, it configures the toggle points it needs
const featureActions = {
  LINK_START1_PAGE_TO_CONTACT: () => ({
    [WIDGET1_CONTINUE_BUTTON]: configureTogglePoint({
      props: { to: '/contact' },
    }),
  }),
};

export const runFeatureAction = actionName => featureActions[actionName]();
