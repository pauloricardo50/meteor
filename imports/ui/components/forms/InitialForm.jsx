import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';

import TextInput from '../general/TextInput.jsx';
import TextInputMoney from '../general/TextInputMoney.jsx';

export default class InitialForm extends React.Component {
  render() {
    return (
      <Panel>
        <form>
          <p>Hi is anyone here!?</p>
          <TextInput />
          <TextInputMoney />
        </form>
      </Panel>
    );
  }
}
