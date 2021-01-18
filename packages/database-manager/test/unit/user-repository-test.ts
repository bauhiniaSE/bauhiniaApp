import { IUser } from 'bauhinia-api/user';
import { expect } from 'chai';

import { UserRepository } from '../../src/user-repository';

let testUser: TestUser;
let userRepo: UserRepository;

describe('user-test', () => {
  beforeEach(() => {
    userRepo = new UserRepository();
    testUser = new TestUser();
    testUser.login = 'login';
    testUser.password = '123';
    testUser.isAdmin = false;
    console.log('Start');
  });

  afterEach(() => {
    userRepo.terminate();
    console.log('End');
  });

  it('user-add-get-test', async () => {
    const isAdded = await userRepo.addUser(testUser);
    const fromDatabaseUser = await userRepo.getUser('login');
    await userRepo.removeUser('login');
    expect(isAdded).equal(0);
    expect(fromDatabaseUser).not.equal(400);
    if (fromDatabaseUser !== 400) {
      expect(fromDatabaseUser.login).equal(testUser.login);
      expect(fromDatabaseUser.password).equal(testUser.password);
      expect(fromDatabaseUser.isAdmin).equal(testUser.isAdmin);
    }
  }).timeout(5000);

  it('user-get-error-test', async () => {
    expect(await userRepo.getUser('a')).equal(400);
  }).timeout(5000);

  it('user-remove-test', async () => {
    await userRepo.addUser(testUser);
    const isRemoved = await userRepo.removeUser('login');
    expect(isRemoved).equal(0);
    expect(await userRepo.getUser('a')).equal(400);
  }).timeout(5000);

  it('user-remove-false-test', async () => {
    const isRemoved = await userRepo.removeUser('a');
    expect(isRemoved).equal(400);
  }).timeout(5000);

  it('user-update-test', async () => {
    await userRepo.addUser(testUser);
    const beforeUpdateUser = await userRepo.getUser('login');
    expect(beforeUpdateUser).not.equal(400);
    if (beforeUpdateUser !== 400) {
      expect(beforeUpdateUser.isAdmin).equal(false);
      testUser.isAdmin = true;
      const updated = await userRepo.updateUser(testUser);
      const updatedUser = await userRepo.getUser('login');
      await userRepo.removeUser('login');
      expect(updated).equal(0);
      expect(updatedUser).not.equal(400);
      if (updatedUser !== 400) {
        expect(updatedUser.isAdmin).equal(true);
      }
    }
  }).timeout(5000);

  it('user-update-false-test', async () => {
    const updated = await userRepo.updateUser(testUser);
    expect(updated).equal(400);
  }).timeout(5000);
});

class TestUser implements IUser {
  public login: string;
  public password: string;
  public isAdmin: boolean;
}
