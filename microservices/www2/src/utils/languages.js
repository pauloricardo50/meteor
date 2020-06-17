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
    signupSuccessText: `Merci de vous être abonné!`,
    recentNewslettersToggle: `Voir les newsletter précédentes`,
    recommendedArticleHeader: `Ceci pourrait vous intéresser`,
    rateTable: {
      header: ['Durée', 'Tendance', 'Taux'],
    },
    rateType: {
      suffix: ' ans',
    },
  },
};

export const getShortLang = language => language.split('-')[0].toLowerCase();

export const getLongLang = language => languageData[language].longLang;

export const getLanguages = () => languages;

export const getLanguageData = language =>
  languageData[language] || languageData.fr;

export default languages;
