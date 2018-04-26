import colors from '../../config/colors';

const mapStyles = [
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#444444' }],
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [{ color: '#f2f2f2' }],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [{ saturation: -100 }, { lightness: 45 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [{ visibility: 'simplified' }],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [{ color: colors.primary }, { visibility: 'on' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      { hue: colors.success },
      { saturation: 1 },
      { lightness: -15 },
      { visibility: 'on' },
    ],
  },
  // {
  //   featureType: 'road.highway',
  //   elementType: 'geometry.fill',
  //   stylers: [{ color: colors.tertiary }, { lightness: '0' }],
  // },

  // Information density
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  // {
  //   featureType: 'road',
  //   elementType: 'labels',
  //   stylers: [{ visibility: 'off' }],
  // },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  // {
  //   featureType: 'road.arterial',
  //   stylers: [{ visibility: 'off' }],
  // },
  // {
  //   featureType: 'road.highway',
  //   elementType: 'labels',
  //   stylers: [{ visibility: 'off' }],
  // },
  // {
  //   featureType: 'road.local',
  //   stylers: [{ visibility: 'off' }],
  // },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text',
    stylers: [{ visibility: 'off' }],
  },
];

export default mapStyles;
