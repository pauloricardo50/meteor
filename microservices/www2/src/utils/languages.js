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
    loginText: `Login`,
    recentNewslettersToggle: `See previous newsletters`,
    signupButtonText: `Sign up`,
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
    loginText: `Se connecter`,
    signupButtonText: `S'inscrire`,
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
