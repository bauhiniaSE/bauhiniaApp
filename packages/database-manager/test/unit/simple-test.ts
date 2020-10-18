import { expect } from 'chai';

import { testFunction } from '../../src/simple-file';

describe('test', () => {
  it('should pass test example', () => {
    const actual = testFunction();
    expect(actual).deep.eq({
      val: 'hello world',
      num: 1234,
    });
  });
});
