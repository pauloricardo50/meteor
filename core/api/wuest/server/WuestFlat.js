import merge from 'lodash/merge';
import Property from './Property';
import { WUEST_HED_METHOD, WUEST_AREA_TYPE } from '../wuestConstants';

class WuestFlat extends Property {
  constructor() {
    super();
    this.method = WUEST_HED_METHOD.CON;
    this.flatType = '';
    this.numberOfFloors = 0;
    this.floorType = '';
    this.numberOfFlats = 0;
    this.usableArea = {
      type: WUEST_AREA_TYPE.NET,
      value: 0,
    };
    this.terraceArea = 0;
  }

  setFlatType(flatType) {
    this.setValue('flatType', flatType);
  }

  setNumberOfFloors(numberOfFloors) {
    this.setValue('numberOfFloors', numberOfFloors);
  }

  setFloorType(floorType) {
    this.setValue('floorType', floorType);
  }

  setNumberOfFlats() {
    this.setValue('numberOfFlats', 2 * this.numberOfFloors);
  }

  setTerraceArea(terraceArea) {
    this.setValue('terraceArea', terraceArea);
  }

  setUsableArea(usableArea) {
    this.setValue('usableArea.value', usableArea);
  }

  setUsableAreaType(usableAreaType) {
    this.setValue('usableArea.type', usableAreaType);
  }

  addUsableAreaToJSON() {
    merge(this.JSONData.embedded[1], {
      rel: 'objectData',
      value: {
        embedded: [
          {
            rel: 'buildings',
            value: [
              {
                isMaster: true,
                usableArea: {
                  type: this.usableArea.type,
                  value: this.usableArea.value,
                },
              },
            ],
          },
        ],
      },
    });
  }

  generateJSONData() {
    merge(this.JSONData, {
      method: this.method,
      hedCon: {
        numberOfRooms: this.numberOfRooms,
        residenceType: this.residenceType,
        flatType: this.flatType,
        floorType: this.floorType,
        numberOfFlats: this.numberOfFlats,
        numberOfFloors: this.numberOfFloors,
        terraceArea: this.terraceArea,
      },
    });

    this.addAddressToJSON();
    this.addParkingToJSON();
    this.addUsableAreaToJSON();
    this.addConstructionYearToJSON();
    this.addMinergieCertificateToJSON();
    this.addQualityProfileToJSON();
  }
}

export default WuestFlat;
