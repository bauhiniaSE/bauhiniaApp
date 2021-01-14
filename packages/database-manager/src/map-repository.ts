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

  constructor(name: string) {
    this.firebaseApp = firebase.initializeApp(firebaseConfig, name);
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
        login: map.login,
        isBlueprint: map.isBlueprint,
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

  public async removeMap(id: string, login: string) {
    let key: string;
    let removeSuccessful = false;
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id) {
          if (childData.login === login) {
            key = childSnapshot.key as string;
            this.database.ref('maps/' + key).remove();
            removeSuccessful = true;
          }
        }
      });
    });

    return removeSuccessful;
  }

  public async getMap(id: string, login: string) {
    const returnMap = new Map();
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id) {
          if (childData.login === login) {
            returnMap.id = childData.id;
            returnMap.height = childData.height;
            returnMap.width = childData.width;
            returnMap.tiles = [];
            returnMap.tiles = childData.tiles;
          }
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
          if (childData.login === map.login) {
            key = childSnapshot.key as string;
            itemFound = true;
          }
        }
      });
    });

    if (itemFound) {
      await this.database.ref(`maps/${key}`).set({
        id: map.id,
        height: map.height,
        width: map.width,
        tiles: map.tiles,
        login: map.login,
        isBlueprint: map.isBlueprint,
      });
      return true;
    } else {
      return false;
    }
  }

  public async getAllBlueprints() {
    const listOfMaps: Map[] = [];
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.isBlueprint) {
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

    if (listOfMaps.length === 0) {
      throw Error('No objects found');
    } else {
      return listOfMaps;
    }
  }

  public async getAllUserMaps(login: string) {
    const listOfMaps: Map[] = [];
    await this.database.ref('maps').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === login) {
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

    if (listOfMaps.length === 0) {
      throw Error('No objects found');
    } else {
      return listOfMaps;
    }
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

    if (listOfIds.length === 0) {
      throw Error('No objects found');
    } else {
      return listOfIds;
    }
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
