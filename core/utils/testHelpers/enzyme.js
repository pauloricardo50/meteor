import defaultEnzyme, {
  configure,
  mount as defaultMount,
  shallow as defaultShallow,
} from 'enzyme';
import Adapter from 'enzyme-react-adapter-future';

configure({ adapter: new Adapter() });

export default defaultEnzyme;
export const mount = defaultMount;
export const shallow = defaultShallow;
