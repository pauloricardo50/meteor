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
    'WwwCalculatorPurchaseType.ACQUISITION': 'Acquisition',
    'WwwCalculatorPurchaseType.REFINANCING': 'Renouvellement',
    'WwwCalculatorFormField.salary': 'Revenus annuels bruts',
    'WwwCalculatorFormField.fortune': 'Fonds propres',
    'WwwCalculatorFormField.property':
      "{purchaseType, select, ACQUISITION {Prix d'achat} other {Valeur du bien}}",
    'WwwCalculatorFormField.currentLoan': 'Prêt existant',
    'WwwCalculatorFormField.wantedLoan': 'Nouveau prêt',
    'WwwCalculatorFormField.increaseSliderMax': 'Agrandir le slider',
    'WwwCalculatorRecap.title': 'Plan financier',
    'WwwCalculatorChart.amortization': 'Amortissement',
    'WwwCalculatorChart.interests': 'Intérêts',
    'WwwCalculatorChart.maintenance': 'Entretien',
    'WwwCalculatorChart.title': 'CHF {total} /mois',
    'WwwCalculatorChartForm.interests': "Taux d'intérêt indicatif",
    'WwwCalculatorChartForm.interestLibor': 'Taux Libor',
    'WwwCalculatorChartForm.interest5': 'Taux 5 ans',
    'WwwCalculatorChartForm.interest10': 'Taux 10 ans',
    'WwwCalculatorChartForm.interest15': 'Taux 15 ans',
    'WwwCalculatorChartForm.interest20': 'Taux 20 ans',
    'WwwCalculatorChartForm.interest25': 'Taux 25 ans',
    'WwwCalculatorChartForm.includeMaintenance':
      "Inclure frais d'entretien (estimation)",
  },
};

export const getShortLang = language => language?.split('-')[0].toLowerCase();

export const getLongLang = language => languageData[language].longLang;

export const getLanguages = () => languages;

export const getLanguageData = language =>
  languageData[language] || languageData.fr;

export default languages;
