import firebase from 'firebase';

import { IObject } from 'bauhinia-api/object';

import { IMaterial } from 'bauhinia-api/object';

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
  private readonly database: any;

  constructor() {
    firebase.initializeApp(firebaseConfig); // To nie może tutaj być, bo można wtedy zrobić tylko jedną instację na cały program
    this.database = firebase.database();
  }

  public addTail(object: IObject) {
    const key: string = this.database.ref('/objects').push().key;
    this.database.ref('/object/' + key).set(
      {
        id: object.id,
        widthWE: object.widthWE,
        widthNS: object.widthNS,
        height: object.height,
        canPlaceOn: object.canPlaceOn,
        albedo: object.material.albedo,
        density: object.material.density,
        price: object.price,
      },
      (error: any) => {
        if (error) {
          // The write failed...
          console.log('Failed');
        } else {
          // Data saved successfully!
          console.log('Success');
        }
      }
    );
  }

  public removeTail(id: string) {}

  public getTail(id: string) {
    this.database.ref('/objects/').once('value', (snapshot: any) => {
      snapshot.forEach((childSnapshot: any) => {
        var dbItem = childSnapshot;
        console.log(dbItem);
      });
    });
  }

  public updateTail(tail: IObject) {}

  public getAllTails() {}
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
