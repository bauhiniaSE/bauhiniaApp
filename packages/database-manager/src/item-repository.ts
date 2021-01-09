import firebase from 'firebase';

import { IMaterial, IObject } from 'bauhinia-api/object';

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

export class ItemRepository {
  private readonly firebaseApp;
  private readonly database;

  constructor() {
    this.firebaseApp = firebase.initializeApp(firebaseConfig);
    this.database = this.firebaseApp.database();
  }

  public async addTail(object: IObject) {
    const key = this.database.ref('/objects').push().key as string;
    await this.database
      .ref(`/object/${key}`)
      .set({
        id: object.id,
        widthWE: object.widthWE,
        widthNS: object.widthNS,
        height: object.height,
        canPlaceOn: object.canPlaceOn,
        albedo: object.material.albedo,
        density: object.material.density,
        price: object.price,
      })
      .then(() => {
        console.log('Synchronization succeeded');
      })
      .catch((error) => {
        console.log('Synchronization failed');
        console.log(error);
      });
  }

  public removeTail(id: string) {}

  public getTail(id: string) {
    this.database.ref('/objects/').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var dbItem = childSnapshot;
        console.log(dbItem);
      });
    });
  }

  public updateTail(tail: IObject) {}

  public getAllTails() {}

  public terminate() {
    this.firebaseApp.delete();
  }
}

export class Item implements IObject {
  public id: string;
  public widthWE: number;
  public widthNS: number;
  public height: number;
  public canPlaceOn: boolean;
  public material: Material;
  public price: number;
}

class Material implements IMaterial {
  public albedo: number;
  public density: number;
}
