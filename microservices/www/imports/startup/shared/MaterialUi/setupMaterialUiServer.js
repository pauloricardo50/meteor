import { SheetsRegistry } from 'react-jss/lib/jss';
import { createGenerateClassName } from 'material-ui/styles';

// This has to be done once for every request from the client
const setupMaterialUiServer = () => {
  const registry = new SheetsRegistry();
  const generateClassName = createGenerateClassName();
  return { registry, generateClassName };
};

export default setupMaterialUiServer;
