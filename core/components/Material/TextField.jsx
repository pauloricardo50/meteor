import React from 'react';

import MuiTextField from '@material-ui/core/TextField';

// To be removed with refactoring
const TextField = props => <MuiTextField {...props} />;

TextField.propTypes = {};

export default TextField;
