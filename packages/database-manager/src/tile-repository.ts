import firebase from 'firebase';

import { IObject } from 'bauhinia-api/object';

import { ITileRepository } from '../tile-repository';

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

export class TileRepository implements ITileRepository {
  private readonly firebaseApp;
  private readonly database;

  constructor() {
    this.firebaseApp = firebase.initializeApp(firebaseConfig, uuidv4());
    this.database = this.firebaseApp.database();
  }

  public async updateTile(object: IObject) {
    let key: string = '';
    let itemFound = 400;
    await this.database.ref('objects').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === object.id) {
          key = childSnapshot.key as string;
          itemFound = 0;
        }
      });
    });
    if (itemFound === 400) {
      key = this.database.ref('objects').push().key as string;
    }
    const addSuccessful = await this.database
      .ref(`objects/${key}`)
      .set({
        id: object.id,
        image: object.image,
        widthWE: object.widthWE,
        widthNS: object.widthNS,
        height: object.height,
        canPlaceOn: object.canPlaceOn,
        albedo: object.material.albedo,
        density: object.material.density,
        plant: object.material.plant,
        price: object.price,
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

  public async removeTile(id: string) {
    let key: string;
    let removeSuccessful = 400;
    await this.database.ref('objects').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id) {
          key = childSnapshot.key as string;
          this.database.ref('objects/' + key).remove();
          removeSuccessful = 0;
        }
      });
    });

    return removeSuccessful;
  }

  public async getTile(id: string) {
    const returnItem: Item = new Item();
    let found = 400;
    await this.database.ref('objects').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.id === id) {
          returnItem.id = childData.id;
          returnItem.image = childData.image;
          returnItem.widthWE = childData.widthWE;
          returnItem.widthNS = childData.widthNS;
          returnItem.height = childData.height;
          returnItem.canPlaceOn = childData.canPlaceOn;
          returnItem.material = {
            albedo: childData.albedo,
            density: childData.density,
            plant: childData.plant,
          };
          returnItem.price = childData.price;
          found = 0;
        }
        return;
      });
    });

    if (found === 400) {
      return 400;
    } else {
      return returnItem;
    }
  }

  public async getAllTiles() {
    const listOfItems: Item[] = [];
    await this.database.ref('objects').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        const returnItem: Item = new Item();
        returnItem.id = childData.id;
        returnItem.image = childData.image;
        returnItem.widthWE = childData.widthWE;
        returnItem.widthNS = childData.widthNS;
        returnItem.height = childData.height;
        returnItem.canPlaceOn = childData.canPlaceOn;
        returnItem.material = {
          albedo: childData.albedo,
          density: childData.density,
          plant: childData.plant,
        };
        returnItem.price = childData.price;
        listOfItems.push(returnItem);
      });
    });

    return listOfItems;
  }

  public terminate() {
    this.firebaseApp.delete();
  }
}

export class Item implements IObject {
  public id: string;
  public image: string = '';
  public widthWE: number = 1;
  public widthNS: number = 1;
  public height: number = 1;
  public canPlaceOn: boolean = false;
  public material = {
    albedo: 0,
    density: 0,
    plant: false,
  };
  public price: number = 0;
}
