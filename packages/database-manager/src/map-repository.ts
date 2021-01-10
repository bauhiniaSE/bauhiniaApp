import firebase from 'firebase';

import { IMap } from 'bauhinia-api/map';

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

export class MapRepository {
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

  public terminate() {
    this.firebaseApp.delete();
  }
}
