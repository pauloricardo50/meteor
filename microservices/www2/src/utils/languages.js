const languages = ['en', 'fr'];

const languageData = {
  en: {
    display: 'EN',
    shortLang: 'en',
    longLang: 'en-us',
    homeLink: '/en/home',
    blogLink: '/en/blog',
    blogLinkText: `Return to index`,
    loginText: 'Login',
    signupButtonText: 'Sign up',
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
    loginText: 'Se connecter',
    signupButtonText: `S'inscrire`,
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
