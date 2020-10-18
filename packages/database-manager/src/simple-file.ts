import { TestInterface } from 'bauhinia-api';

export const testFunction: () => TestInterface = () => {
  return {
    val: 'hello world',
    num: 1234,
  };
};
