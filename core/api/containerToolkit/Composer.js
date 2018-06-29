import { compose } from 'recompose';
import sinon from 'sinon';

class Composer {
  compose = (...args) => compose(...args);
}

const composer = new Composer();

sinon.spy(composer, 'compose');

export default composer;
