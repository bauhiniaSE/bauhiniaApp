import firebase from 'firebase';

import { IUser } from 'bauhinia-api/user';

import { IUserRepository } from '../user-repository';

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
export class UserRepository implements IUserRepository {
  private readonly firebaseApp;
  private readonly database;

  constructor() {
    this.firebaseApp = firebase.initializeApp(firebaseConfig, uuidv4());
    this.database = this.firebaseApp.database();
  }

  public async addUser(user: IUser) {
    const key = this.database.ref('users').push().key as string;
    const addSuccessful = await this.database
      .ref(`users/${key}`)
      .set({
        login: user.login,
        password: user.password,
        isAdmin: user.isAdmin,
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

  public async removeUser(login: string) {
    let key: string;
    let removeSuccessful = 400;
    await this.database.ref('users').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === login) {
          key = childSnapshot.key as string;
          this.database.ref('users/' + key).remove();
          removeSuccessful = 0;
          return;
        }
      });
    });

    return removeSuccessful;
  }

  public async getUser(login: string) {
    const returnUser: User = new User();
    let userFound = 400;
    await this.database.ref('users').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === login) {
          returnUser.isAdmin = childData.isAdmin;
          returnUser.login = childData.login;
          returnUser.password = childData.password;
          userFound = 0;
        }
        return;
      });
    });

    if (userFound === 400) {
      return 400;
    } else {
      return returnUser;
    }
  }

  public async updateUser(user: IUser) {
    let key: string = '';
    let userFound = 400;
    await this.database.ref('users').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === user.login) {
          key = childSnapshot.key as string;
          userFound = 0;
        }
      });
    });

    if (userFound === 0) {
      await this.database.ref(`users/${key}`).set({
        login: user.login,
        password: user.password,
        isAdmin: user.isAdmin,
      });
      return 0;
    } else {
      return 400;
    }
  }

  public terminate() {
    this.firebaseApp.delete();
  }
}

class User implements IUser {
  public login: string;
  public password: string;
  public isAdmin: boolean;
}
