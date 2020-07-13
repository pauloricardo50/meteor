const languages = ['fr'];

const languageData = {
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
    promoInterest: `{sent, select, true {Intéressé} other {Je suis intéressé}}`,
    'promoInterest.title': 'Intérêt pour la promotion {promotionName}',
    'promoInterest.description':
      'Dites-en nous un peu plus sur votre projet et un de nos conseillers prendra contact avec vous pour en discuter.',
    'promoInterest.form.name': 'Nom',
    'promoInterest.form.email': 'Email',
    'promoInterest.form.phoneNumber': 'Téléphone',
    'promoInterest.form.details': 'Commentaire',
    signupButtonText: `S'inscrire`,
    signupModal: `Newsletter`,
    'signupModal.title': `S'inscrire à la newsletter`,
    'signupModal.description': `Chaque mois, e-Potek fait le point sur l'actualité et les sujets liés au financement hypothécaire.`,
    getALoanText: `Obtenir un prêt`,
    signupErrorText: `Un problème est survenu! Réessayez ultérieurement`,
    signupSuccessText: `Merci de vous être abonné!`,
    recentNewslettersToggle: `Voir les newsletters précédentes`,
    recommendedArticleHeader: `Nos articles récents`,
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
    close: 'Fermer',
    cancel: 'Annuler',
    submit: 'Envoyer',
    more: 'Afficher plus',
    less: 'Afficher moins',
    'WwwCalculatorRecap.project': 'Projet',
    'WwwCalculatorRecap.notaryFees': 'Frais de notaire',
    'WwwCalculatorRecap.financing': 'Financement',
    'WwwCalculatorRecap.ownFunds': 'Fonds propres',
    'WwwCalculatorRecap.mortgageLoan': 'Prêt hypothécaire',
    'WwwCalculatorRecap.totalFinancing': 'Financement total',
    'WwwCalculatorRecap.totalCost': 'Coût total du projet',
    'WwwCalculatorRecap.maxPossibleLoan': 'Hypothèque max. possible',
    'WwwCalculatorRecap.loanIncrease': 'Augmentation du prêt',
    'WwwCalculatorRecap.loanReduction': 'Réduction du prêt',
    'WwwCalculatorFinma.title': 'Règles FINMA',
    'WwwCalculatorRecap.borrowRule':
      "Prêt / {purchaseType, select, ACQUISITION {Prix d'achat} other {Valeur du bien}}",
    'WwwCalculatorRecap.incomeRule': 'Charges / Revenus',
    'WwwCalculatorStatus.borrowError':
      'Les fonds propres ne suffisent pas pour votre projet. Continuez et parlons-en',
    'WwwCalculatorStatus.borrowWarning':
      'Les fonds propres ne sont pas dans les normes attendues, mais il existe des solutions. Continuez et parlons-en.',
    'WwwCalculatorStatus.empty':
      'Entrez des valeurs dans les champs au dessus !',
    'WwwCalculatorStatus.incomeError':
      'Les revenus ne suffisent pas pour votre projet. Continuez et parlons-en.',
    'WwwCalculatorStatus.incomeWarning':
      'Les revenus ne sont pas dans les normes attendues, mais il existe des solutions. Continuez et parlons-en.',
    'WwwCalculatorStatus.success': 'Tout est bon !',
  },
};

export const getShortLang = language =>
  language?.split('-')[0].toLowerCase() || 'fr';

export const getLongLang = language => languageData[language].longLang;

export const getLanguages = () => languages;

export const getLanguageData = language =>
  languageData[language] || languageData.fr;

export default languages;
