import set from 'lodash/set';
import merge from 'lodash/merge';
import Property from './Property';
import { HED_METHOD, AREA_TYPE } from '../wuestConstants';

class Flat extends Property {
  constructor() {
    super();
    this.method = HED_METHOD.CON;
    this.flatType = '';
    this.numberOfFloors = 0;
    this.floorType = '';
    this.numberOfFlats = 0;
    this.usableArea = {
      type: AREA_TYPE.NET,
      value: 0,
    };
    this.terraceArea = 0;
  }

  setFlatType(flatType) {
    set(this, 'flatType', flatType);
  }

  setNumberOfFloors(numberOfFloors) {
    set(this, 'numberOfFloors', numberOfFloors);
  }

  setFloorType(floorType) {
    set(this, 'floorType', floorType);
  }

  setNumberOfFlats() {
    set(this, 'numberOfFlats', 2 * this.numberOfFloors);
  }

  setTerraceArea(terraceArea) {
    set(this, 'terraceArea', terraceArea);
  }

  setUsableArea(usableArea) {
    set(this, 'usableArea.value', usableArea);
  }

  setUsableAreaType(usableAreaType) {
    set(this, 'usableArea.type', usableAreaType);
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

export default Flat;
