const languages = ['en', 'fr'];

const languageData = {
  en: {
    display: 'EN',
    shortLang: 'en',
    longLang: 'en-us',
    homeLink: '/en/home',
    blogLink: '/en/blog',
    blogLinkText: `Return to index`,
    cookieAccept: `I accept`,
    cookieDecline: `Decline`,
    contactLocationText: [`Find us in`, `And in`],
    followUs: `Follow us`,
    loginText: `Login`,
    promoInterest: `I am interested`,
    recentNewslettersToggle: `See previous newsletters`,
    signupButtonText: `Sign up`,
    getALoanText: `Get a loan`,
    signupErrorText: `There was a problem subscribing. Please try again`,
    signupSuccessText: `Thank you for subscribing!`,
    recommendedArticleHeader: `This might interest you`,
    rateTable: {
      header: ['Duration', 'Trend', 'Rate'],
    },
    rateType: {
      suffix: '-Year',
    },
  },
  fr: {
    display: 'FR',
    shortLang: 'fr',
    longLang: 'fr-ch',
    homeLink: '/fr/accueil',
    blogLink: '/fr/blog',
    blogLinkText: `Revenir à l'index`,
    cookieAccept: `J'accepte`,
    cookieDecline: `Refuser`,
    contactLocationText: [`Trouver nous à`, `Et à`],
    followUs: `Suivez-nous`,
    loginText: `Se connecter`,
    promoInterest: `Je suis intéressé`,
    signupButtonText: `S'inscrire`,
    getALoanText: `Obtenir un prêt`,
    signupErrorText: `Un problème est survenu lors de l'inscription. Veuillez réessayer.`,
    signupSuccessText: `Merci de vous être abonné!`,
    recentNewslettersToggle: `Voir les newsletters précédentes`,
    recommendedArticleHeader: `Ceci pourrait vous intéresser`,
    rateTable: {
      header: ['Durée', 'Tendance', 'Taux'],
    },
    rateType: {
      suffix: ' ans',
    },
    'cityMarker.title': 'Région de {city}',
    'cityMarker.count': '{count} dossiers en cours ou terminés',
    'canton.AG': 'Aargau',
    'canton.AR': 'Appenzell Ausserrhoden',
    'canton.AI': 'Appenzell Innerrhoden',
    'canton.BL': 'Basel-Land',
    'canton.BS': 'Basel-Stadt',
    'canton.BE': 'Bern',
    'canton.FR': 'Fribourg',
    'canton.GE': 'Genève',
    'canton.GL': 'Glarus',
    'canton.GR': 'Graubünden',
    'canton.JU': 'Jura',
    'canton.LU': 'Luzern',
    'canton.NE': 'Neuchâtel',
    'canton.NW': 'Nidwalden',
    'canton.OW': 'Obwalden',
    'canton.SG': 'St. Gallen',
    'canton.SH': 'Schaffhausen',
    'canton.SZ': 'Schwyz',
    'canton.SO': 'Solothurn',
    'canton.TG': 'Thurgau',
    'canton.TI': 'Ticino',
    'canton.UR': 'Uri',
    'canton.VD': 'Vaud',
    'canton.VS': 'Valais',
    'canton.ZG': 'Zug',
    'canton.ZH': 'Zürich',
    'canton.LI': 'Liechtenstein',
    all: 'Tous',
    noResult: 'Aucun résultat',
    promotionLotsCount: '{lotsCount} lots',
    promotionFinished: 'Terminée',
  },
};

export const getShortLang = language => language.split('-')[0].toLowerCase();

export const getLongLang = language => languageData[language].longLang;

export const getLanguages = () => languages;

export const getLanguageData = language =>
  languageData[language] || languageData.fr;

export default languages;
