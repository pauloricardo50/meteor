import set from 'lodash/set';
import merge from 'lodash/merge';
import Property from './Property';
import { HED_METHOD, VOLUME_TYPE } from '../wuestConstants';

class House extends Property {
  constructor() {
    super();
    this.method = HED_METHOD.SFH;
    this.houseType = '';
    this.buildingVolume = {
      type: VOLUME_TYPE.SIA_416,
      value: 0,
    };
    this.landPlotArea = 0;
  }

  addBuildingVolumeToJSON() {
    merge(this.JSONData.embedded[1], {
      rel: 'objectData',
      value: {
        embedded: [
          {
            rel: 'buildings',
            value: [
              {
                isMaster: true,
                buildingVolume: {
                  type: this.buildingVolume.type,
                  value: this.buildingVolume.value,
                },
              },
            ],
          },
        ],
      },
    });
  }

  addLandPlotAreaToJSON() {
    set(this.JSONData, 'embedded[1].value.embedded[1]', {
      rel: 'landPlots',
      value: [
        {
          isMaster: true,
          landPlotArea: this.landPlotArea,
        },
      ],
    });
  }

  generateJSONData() {
    merge(this.JSONData, {
      method: this.method,
      hedSfh: {
        numberOfRooms: this.numberOfRooms,
        residenceType: this.residenceType,
        houseType: this.houseType,
      },
    });

    this.addAddressToJSON();
    this.addBuildingVolumeToJSON();
    this.addParkingToJSON();
    this.addConstructionYearToJSON();
    this.addMinergieCertificateToJSON();
    this.addQualityProfileToJSON();
    this.addLandPlotAreaToJSON();
  }
}

export default House;
