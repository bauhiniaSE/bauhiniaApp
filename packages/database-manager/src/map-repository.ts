import firebase from 'firebase';

import { IMap, IObjectOnMap } from 'bauhinia-api/map';

import { IMapRepository } from '../map-repository';

import { uuidv4 } from './uuid';

const firebaseConfig = {
  apiKey: 'AIzaSyAL6nH17dJATWEMvOHNiqtO9KAqRwrZ658',
  authDomain: 'bauhiniaapp.firebaseapp.com',
  databaseURL: 'https://bauhiniaapp-default-rtdb.firebaseio.com',
  projectId: 'bauhiniaapp',
  storageBucket: 'bauhiniaapp.appspot.com',
  messagingSenderId: '497286109863',
  appId: '1:497286109863:web:cea0375376b2112bf65982',
  measurementId: 'G-H3CP2N7F79',
};

export class MapRepository implements IMapRepository {
  private readonly firebaseApp;
  private readonly database;

  constructor() {
    this.firebaseApp = firebase.initializeApp(firebaseConfig, uuidv4());
    this.database = this.firebaseApp.database();
  }

  public async updateMap(map: IMap) {
    let key: string = '';
    let itemFound = 200;
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === map.id && childData.login === map.login) {
          key = childSnapshot.key as string;
          itemFound = 0;
        }
      });
    });

    if (itemFound === 200) {
      key = this.database.ref('maps').push().key as string;
    }

    const addSuccessful = await this.database
      .ref(`maps/${key}`)
      .set({
        id: map.id,
        height: map.height,
        width: map.width,
        tiles: map.tiles,
        login: map.login,
        isBlueprint: map.isBlueprint,
      })
      .then(() => {
        console.log('Synchronization succeeded');
        return 0;
      })
      .catch((error) => {
        console.log('Synchronization failed');
        console.log(error);
        return 600;
      });

    return addSuccessful;
  }

  public async removeMap(id: string, login: string) {
    let key: string;
    let removeSuccessful = 200;
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id && childData.login === login) {
          key = childSnapshot.key as string;
          this.database.ref('maps/' + key).remove();
          removeSuccessful = 0;
          return;
        }
      });
    });

    return removeSuccessful;
  }

  public async getMap(id: string, login: string) {
    let returnMap: Map = new Map();
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val() as Map;
        if (childData.id === id && childData.login === login) {
          returnMap = childData;
          return;
        }
      });
    });

    if (JSON.stringify(returnMap) === JSON.stringify({})) {
      return 400;
    } else {
      return returnMap;
    }
  }

  public async getAllBlueprints() {
    const listOfMaps: Map[] = [];
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.isBlueprint) {
          const returnMap: Map = new Map();
          returnMap.id = childData.id;
          returnMap.height = childData.height;
          returnMap.width = childData.width;
          returnMap.tiles = childData.tiles;
          returnMap.login = childData.login;
          returnMap.isBlueprint = childData.isBlueprint;
          listOfMaps.push(returnMap);
        }
      });
    });

    return listOfMaps;
  }

  public async getAllUserMaps(login: string) {
    const listOfMaps: Map[] = [];
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === login && !childData.isBlueprint) {
          const returnMap: Map = new Map();
          returnMap.tiles = [];
          returnMap.id = childData.id;
          returnMap.height = childData.height;
          returnMap.width = childData.width;
          returnMap.tiles = childData.tiles;
          returnMap.login = childData.login;
          returnMap.isBlueprint = childData.isBlueprint;
          listOfMaps.push(returnMap);
        }
      });
    });

    return listOfMaps;
  }

  public async getAllUserMapsIds(login: string) {
    const listOfIds: string[] = [];
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === login) {
          listOfIds.push(childData.id);
        }
      });
    });

    return listOfIds;
  }

  public terminate() {
    this.firebaseApp.delete();
  }
}

class Map implements IMap {
  public login: string;
  public isBlueprint: boolean;
  public id: string;
  public height: number;
  public width: number;
  public tiles: IObjectOnMap[];
}

export { uuidv4, Map };
