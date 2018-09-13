import set from 'lodash/set';
import merge from 'lodash/merge';
import {
  WUEST_MINERGIE_CERTIFICATE,
  WUEST_JSON_DATA_STRUCTURE,
} from '../wuestConstants';

class Property {
  constructor() {
    this.method = '';
    this.address = {
      addressLine1: '',
      zipCode: '',
      place: '',
      countryIsoCode: '',
    };
    this.numberOfRooms = 0;
    this.residenceType = '';
    this.parking = {
      indoor: 0,
      outdoor: 0,
    };
    this.constructionYear = 0;
    this.minergieCertificate = WUEST_MINERGIE_CERTIFICATE.WITHOUT_CERTIFICATE;
    this.qualityProfile = {
      standard: 0,
      condition: 0,
    };
    this.JSONData = WUEST_JSON_DATA_STRUCTURE;
  }

  setValue({ path, value }) {
    set(this, path, value);
  }

  addAddressToJSON() {
    merge(this.JSONData.embedded[1], {
      rel: 'objectData',
      value: {
        ownershipType: 'SOLE_OWNERSHIP',
        location: { address: this.address },
      },
    });
  }

  addParkingToJSON() {
    merge(this.JSONData.embedded[0], {
      rel: 'valueCorrections',
      value: [
        {
          type: 'PARKING',
          details: {
            numberOfOutdoorParkingSpaces: this.parking.outdoor,
            numberOfGarageParkingSpaces: this.parking.indoor,
          },
        },
      ],
    });
  }

  addConstructionYearToJSON() {
    merge(this.JSONData.embedded[1], {
      rel: 'objectData',
      value: {
        embedded: [
          {
            rel: 'buildings',
            value: [
              {
                isMaster: true,
                constructions: [{ year: this.constructionYear }],
              },
            ],
          },
        ],
      },
    });
  }

  addMinergieCertificateToJSON() {
    merge(this.JSONData.embedded[1], {
      rel: 'objectData',
      value: {
        embedded: [
          {
            rel: 'buildings',
            value: [
              {
                isMaster: true,
                minergieCertificate: this.minergieCertificate,
              },
            ],
          },
        ],
      },
    });
  }

  addQualityProfileToJSON() {
    merge(this.JSONData.embedded[2], {
      rel: 'qualityProfile',
      value: {
        entries: [
          {
            type: 'residential.object.standard',
            grade: { manualValue: this.qualityProfileStandard },
          },
          {
            type: 'residential.object.condition',
            grade: { manualValue: this.qualityProfileCondition },
          },
          {
            type: 'residential.location.microlocation',
          },
        ],
      },
    });
  }
}

export default Property;
