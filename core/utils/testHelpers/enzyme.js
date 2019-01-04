import defaultEnzyme, {
  configure,
  mount as defaultMount,
  shallow as defaultShallow,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Avoid weird wallaby bug, inspired from here
// https://github.com/wallabyjs/public/issues/1487
global.HTMLInputElement = () => {};

export default defaultEnzyme;
export const mount = defaultMount;
export const shallow = defaultShallow;
