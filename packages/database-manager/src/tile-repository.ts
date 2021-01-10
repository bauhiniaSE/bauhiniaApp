import firebase from 'firebase';

import { IMaterial, IObject } from 'bauhinia-api/object';

import { ITileRepository } from '../tile-repository';

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

export class TileRepository implements ITileRepository {
  private readonly firebaseApp;
  private readonly database;

  constructor() {
    this.firebaseApp = firebase.initializeApp(firebaseConfig, 'item');
    this.database = this.firebaseApp.database();
  }

  public async addTile(object: IObject) {
    const key = this.database.ref('objects').push().key as string;
    const addSuccessful = await this.database
      .ref(`objects/${key}`)
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
        return true;
      })
      .catch((error) => {
        console.log('Synchronization failed');
        console.log(error);
        return false;
      });
    return addSuccessful;
  }

  public async removeTile(id: string) {
    let key: string;
    let removeSuccessful = false;
    await this.database.ref('objects').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id) {
          key = childSnapshot.key as string;
          this.database.ref('objects/' + key).remove();
          removeSuccessful = true;
        }
      });
    });

    return removeSuccessful;
  }

  public async getTile(id: string) {
    const returnItem: Item = new Item();
    await this.database.ref('objects').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id) {
          returnItem.id = childData.id;
          returnItem.widthWE = childData.widthWE;
          returnItem.widthNS = childData.widthNS;
          returnItem.height = childData.height;
          returnItem.canPlaceOn = childData.canPlaceOn;
          returnItem.material = new Material();
          returnItem.material.albedo = childData.albedo;
          returnItem.material.density = childData.density;
          returnItem.price = childData.price;
        }
      });
    });

    if (JSON.stringify(returnItem) === JSON.stringify({})) {
      throw new Error('Object does not exist');
    } else {
      return returnItem;
    }
  }
  // you should not update id. To update id remove and add item.
  public async updateTile(item: IObject) {
    let key: string = '';
    let itemFound = false;
    await this.database.ref('objects').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === item.id) {
          key = childSnapshot.key as string;
          itemFound = true;
        }
      });
    });

    if (itemFound) {
      await this.database.ref(`objects/${key}`).set({
        id: item.id,
        widthWE: item.widthWE,
        widthNS: item.widthNS,
        height: item.height,
        canPlaceOn: item.canPlaceOn,
        albedo: item.material.albedo,
        density: item.material.density,
        price: item.price,
      });
      return true;
    } else {
      return false;
    }
  }
  // last added item is first in the array
  public async getAllTiles() {
    const listOfItems: Item[] = [];
    await this.database.ref('objects').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        const returnItem: Item = new Item();
        returnItem.id = childData.id;
        returnItem.widthWE = childData.widthWE;
        returnItem.widthNS = childData.widthNS;
        returnItem.height = childData.height;
        returnItem.canPlaceOn = childData.canPlaceOn;
        returnItem.material = new Material();
        returnItem.material.albedo = childData.albedo;
        returnItem.material.density = childData.density;
        returnItem.price = childData.price;
        listOfItems.push(returnItem);
      });
    });

    if (listOfItems.length === 0) {
      throw Error('No objects found');
    } else {
      return listOfItems;
    }
  }

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
