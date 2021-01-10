import firebase from 'firebase';

import { IMap, IObjectOnMap } from 'bauhinia-api/map';

import { IMapRepository } from '../map-repository';

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
    this.firebaseApp = firebase.initializeApp(firebaseConfig, 'map');
    this.database = this.firebaseApp.database();
  }

  public async addMap(map: IMap) {
    const key = this.database.ref('maps').push().key as string;
    const addSuccessful = await this.database
      .ref(`maps/${key}`)
      .set({
        id: map.id,
        height: map.height,
        width: map.width,
        tiles: map.tiles,
      })
      .then(() => {
        console.log('Synchronization succeeded');
        return true;
      })
      .catch((error) => {
        console.log('Synchronization failed');
        console.log(error);
        return false;
      });

    return addSuccessful;
  }

  public async removeMap(id: string) {
    let key: string;
    let removeSuccessful = false;
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id) {
          key = childSnapshot.key as string;
          this.database.ref('maps/' + key).remove();
          removeSuccessful = true;
        }
      });
    });

    return removeSuccessful;
  }

  public async getMap(id: string) {
    const returnMap = new Map();
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id) {
          returnMap.id = childData.id;
          returnMap.height = childData.height;
          returnMap.width = childData.width;
          returnMap.tiles = [];
          returnMap.tiles = childData.tiles;
        }
      });
    });

    if (JSON.stringify(returnMap) === JSON.stringify({})) {
      throw new Error('Object does not exist');
    } else {
      return returnMap;
    }
  }

  public async updateMap(map: IMap) {
    let key: string = '';
    let itemFound = false;
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === map.id) {
          key = childSnapshot.key as string;
          itemFound = true;
        }
      });
    });

    if (itemFound) {
      await this.database.ref(`maps/${key}`).set({
        id: map.id,
        height: map.height,
        width: map.width,
        tiles: map.tiles,
      });
      return true;
    } else {
      return false;
    }
  }

  public async getAllMaps() {
    const listOfMaps: Map[] = [];
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        const returnMap: Map = new Map();
        returnMap.tiles = [];
        returnMap.id = childData.id;
        returnMap.height = childData.height;
        returnMap.width = childData.width;
        returnMap.tiles = childData.tiles;
        listOfMaps.push(returnMap);
      });
    });

    if (listOfMaps.length === 0) {
      throw Error('No objects found');
    } else {
      return listOfMaps;
    }
  }

  public terminate() {
    this.firebaseApp.delete();
  }
}

class Map implements IMap {
  public id: string;
  public height: number;
  public width: number;
  public tiles: IObjectOnMap[];
}
