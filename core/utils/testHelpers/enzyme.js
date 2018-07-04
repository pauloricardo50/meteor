import defaultEnzyme, {
  configure,
  mount as defaultMount,
  shallow as defaultShallow,
} from 'enzyme';
// this adapter should be replaced with the next enzyme release
// NOTE: make sure you didn't install enzyme or the adapters in core
//       only in microservices because then if enzyme is required from
//       the core npm modules but the adapter from the microservice,
//       it will trigger an error hard to understand. They should both
//       be required from the same place
import Adapter from 'enzyme-react-adapter-future';

configure({ adapter: new Adapter() });

export default defaultEnzyme;
export const mount = defaultMount;
export const shallow = defaultShallow;
