import { IUser } from 'bauhinia-api/user';
import { expect } from 'chai';

import { UserRepository } from '../../src/user-repository';

let testUser: TestUser;
let userRepo: UserRepository;

describe('user-test', () => {
  beforeEach(() => {
    userRepo = new UserRepository('user_test');
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
    expect(isAdded).equal(true);
    expect(fromDatabaseUser.login).equal(testUser.login);
    expect(fromDatabaseUser.password).equal(testUser.password);
    expect(fromDatabaseUser.isAdmin).equal(testUser.isAdmin);
  }).timeout(5000);

  it('user-get-error-test', async () => {
    await expect(userRepo.getUser('a')).to.be.rejectedWith(Error);
  }).timeout(5000);

  it('user-remove-test', async () => {
    await userRepo.addUser(testUser);
    const isRemoved = await userRepo.removeUser('login');
    expect(isRemoved).equal(true);
    await expect(userRepo.getUser('a')).to.be.rejectedWith(Error);
  }).timeout(5000);

  it('user-remove-false-test', async () => {
    const isRemoved = await userRepo.removeUser('a');
    expect(isRemoved).equal(false);
  }).timeout(5000);

  it('user-update-test', async () => {
    await userRepo.addUser(testUser);
    const beforeUpdateUser = await userRepo.getUser('login');
    expect(beforeUpdateUser.isAdmin).equal(false);
    testUser.isAdmin = true;
    const updated = await userRepo.updateUser(testUser);
    const updatedUser = await userRepo.getUser('login');
    await userRepo.removeUser('login');
    expect(updated).equal(true);
    expect(updatedUser.isAdmin).equal(true);
  }).timeout(5000);

  it('user-update-false-test', async () => {
    const updated = await userRepo.updateUser(testUser);
    expect(updated).equal(false);
  }).timeout(5000);
});

class TestUser implements IUser {
  public login: string;
  public password: string;
  public isAdmin: boolean;
}
