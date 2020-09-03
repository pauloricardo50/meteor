import SimpleSchema from 'simpl-schema';

import intl from '../intl';

const { formatMessage } = intl;

const translate = ({ label }) => label;

const translateSimpleSchema = () => {
  SimpleSchema.setDefaultMessages({
    initialLanguage: 'fr',
    messages: {
      fr: {
        // Can also use "name"
        required: args => {
          console.log('args:', args);

          return `${translate(args)} est requis`;
        },
        minString: args =>
          `${translate(args)} doit faire au minimum ${args.min} caractères`,
        maxString: args =>
          `${translate(args)} peut faire au maximum ${args.max} caractères`,
        minNumber: args => `${translate(args)} doit être au moins ${args.min}`,
        maxNumber: args =>
          `${translate(args)} ne peut pas dépasser ${args.max}`,
        minNumberExclusive: args =>
          `${translate(args)} doit être plus grand que ${args.min}`,
        maxNumberExclusive: args =>
          `${translate(args)} doit être plus petit que ${args.max}`,
        minDate: args =>
          `${translate(args)} doit être au plus tôt le ${args.min}`,
        maxDate: args =>
          `${translate(args)} doit être au plus tard le ${args.max}`,
        badDate: args => `${translate(args)} n'est pas une date valide`,
        minCount: ({ minCount }) =>
          `Vous devez ajouter au moins ${minCount} valeurs`,
        maxCount: ({ maxCount }) =>
          `Vous devez choisir moins de ${maxCount} valeurs`,
        noDecimal: args => `${translate(args)} doit être un nombre entier`,
        notAllowed: ({ value }) => `${value} n'est pas valide`,
        expectedType: args =>
          `${translate(args)} doit être un ${args.dataType}`,
        regEx({ label, regExp }) {
          switch (regExp) {
            case SimpleSchema.RegEx.Email:
            case SimpleSchema.RegEx.WeakEmail:
              return 'Cette adresse email est incorrecte';
            default:
              return "Le format n'est pas valide";
          }
        },
        noOther: 'Veuillez préciser',
      },
    },
  });
};

export default translateSimpleSchema;
