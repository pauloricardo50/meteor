import shuffle from 'lodash/shuffle';

const strings = [
  'Coloriage des boutons',
  'Ajustement des effets pyrotechniques',
  'Obtention des meilleurs taux',
  'Alerte de notre conseiller le plus sympa',
  'Paiement des pots-de-vin',
  "Préchauffage de l'ordinateur",
  'Pose de la cerise sur le gateau',
  'Mise à jour des régulations fédérales',
  'Optimisation des investissements',
  'Augmentation de la vue sur le lac',
  'Construction des vérandas',
  'Désherbage du jardin',
  'Préparation des contrats',
  'Passage au web 3.0',
  'Mise en place de la tuyauterie digitale',
];

const lateStrings = [
  'Résolution de la paix dans le monde',
  'Contact de Mr. Internet',
  'Attente de la fin du sablier...',
  'Début du mode attente_interminable_v2',
];

const animationDuration = 250;
const animationInterval = 2000;
const animationCurve = 'ease-in-out';

// show 0-250, hide 1500-1750
// show 1750-2000, hide 3500-3750
// show 3750-4000, hide 5500-5750
// show 5750-6000, hide 7500-7750

const getAnimation = (index, type) => {
  const animationName = type;
  let delay = 0;
  if (type === 'show') {
    delay = index === 0 ? 0 : animationInterval * index - animationDuration;
  } else if (type === 'hide') {
    delay = animationInterval * (index + 1) - animationDuration * 2;
  }
  return `${animationName} ${animationDuration}ms ${delay}ms ${animationCurve} forwards`;
};

const getStyles = (values) => {
  let style = '<style>';
  style += `
    .text {
      opacity: 0;
      position: absolute;
      top: calc(50% + 40px);
      color: #4990E2;
      width: 100%;
      text-align: center;
    }
  `;

  for (let i = 0; i < values.length; i++) {
    const animation1 = getAnimation(i, 'show');
    const animation2 = getAnimation(i, 'hide');
    style += `
      #id${i} {
      animation: ${animation1}, ${animation2};
      -webkit-animation: ${animation1}, ${animation2};
    }
    `;
  }

  style += `
    @keyframes hide {
      0%{opacity: 1;}
      100%{opacity: 0;}
    }

    @keyframes show {
      0%{opacity: 0;}
      100%{opacity: 1;}
    }
    `;

  style += '</style>';

  return style;
};

const getTexts = (values) => {
  let texts = '';

  values.forEach((value, index) => {
    texts += `<h1 class="text" id="id${index}">`;
    texts += value;
    texts += '</h1>';
  });

  return texts;
};

const getHtml = () => {
  // Add a break between the regular strings and the slow late strings
  const values = [
    ...shuffle(strings).slice(0, 10),
    ' ',
    ...shuffle(lateStrings),
  ];
  let html = '';
  html += '<div id="loading-text">';
  html += getStyles(values);
  html += getTexts(values);
  html += '</div>';

  return html;
};

export default getHtml;
