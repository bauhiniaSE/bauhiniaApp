import firebase from 'firebase';

import { IUser } from 'bauhinia-api/user';

import { IUserRepository } from '../user-repository';

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

  constructor(name: string) {
    this.firebaseApp = firebase.initializeApp(firebaseConfig, name);
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
        return true;
      })
      .catch((error) => {
        console.log('Synchronization failed');
        console.log(error);
        return false;
      });
    return addSuccessful;
  }

  public async removeUser(login: string) {
    let key: string;
    let removeSuccessful = false;
    await this.database.ref('users').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === login) {
          key = childSnapshot.key as string;
          this.database.ref('users/' + key).remove();
          removeSuccessful = true;
        }
      });
    });

    return removeSuccessful;
  }

  public async getUser(login: string) {
    const returnUser: User = new User();
    await this.database.ref('users').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === login) {
          returnUser.isAdmin = childData.isAdmin;
          returnUser.login = childData.login;
          returnUser.password = childData.password;
        }
      });
    });

    if (JSON.stringify(returnUser) === JSON.stringify({})) {
      throw new Error('User does not exist');
    } else {
      return returnUser;
    }
  }

  public async updateUser(user: IUser) {
    let key: string = '';
    let userFound = false;
    await this.database.ref('users').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.login === user.login) {
          key = childSnapshot.key as string;
          userFound = true;
        }
      });
    });

    if (userFound) {
      await this.database.ref(`users/${key}`).set({
        login: user.login,
        password: user.password,
        isAdmin: user.isAdmin,
      });
      return true;
    } else {
      return false;
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
