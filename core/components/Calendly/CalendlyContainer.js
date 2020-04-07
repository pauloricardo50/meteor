import { withProps } from 'recompose';

const SCRIPT_SOURCE = 'https://assets.calendly.com/assets/external/widget.js';

export default withProps(() => ({
  scriptSource: SCRIPT_SOURCE,
  loadScript: (onLoad = () => ({})) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SOURCE;
    script.onload = onLoad || (() => null);

    document.body.appendChild(script);
  },
}));
