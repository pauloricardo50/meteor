import SimpleSchema from 'simpl-schema';
import formatMessage from '../intl';

const translate = ({ key }) => {
  // Turns a key called "expenses.0.value" into "expenses.value"
  const keyWithoutNumbers = key
    .split('.')
    .filter(subKey => subKey.length !== 1)
    .join('.');
  return formatMessage(`Forms.${keyWithoutNumbers}`);
};

const translateSimpleSchema = () => {
  SimpleSchema.setDefaultMessages({
    initialLanguage: 'fr',
    messages: {
      fr: {
        // Can also use "name"
        required: args => `${translate(args)} est requis`,
        minString: args =>
          `${translate(args)} doit faire au minimum {{min}} caractères`,
        maxString: args =>
          `${translate(args)} peut faire au maximum {{max}} caractères`,
        minNumber: args => `${translate(args)} doit être au moins {{min}}`,
        maxNumber: args => `${translate(args)} ne peut pas dépasser {{max}}`,
        minNumberExclusive: args =>
          `${translate(args)} doit être plus grand que {{min}}`,
        maxNumberExclusive: args =>
          `${translate(args)} doit être plus petit que {{max}}`,
        minDate: args => `${translate(args)} doit être au plus tôt le {{min}}`,
        maxDate: args => `${translate(args)} doit être au plus tard le {{max}}`,
        badDate: args => `${translate(args)} n'est pas une date valide`,
        minCount: () => 'Vous devez ajouter au moins {{minCount}} valeurs',
        maxCount: () => 'Vous devez choisir moins de {{maxCount}} valeurs',
        noDecimal: args => `${translate(args)} doit être un nombre entier`,
        notAllowed: () => "{{value}} n'est pas valide",
        expectedType: args => `${translate(args)} doit être un {{dataType}}`,
      },
    },
  });
};

translateSimpleSchema();
