import { expect } from 'chai';

const recipe = {
  eggs: 1,
  flour: 500,
  milk: 300,
  salt: 'little',
  sugar: 'yes',
};

describe('test', () => {
  it('should bake a bread', () => {
    expect(true).equal(true);
  });
  it('should give pancake recipe', () => {
    expect(recipe.eggs).equal(1);
    expect(recipe.flour).equal(500);
    expect(recipe.milk).equal(300);
    expect(recipe.salt).equal('little');
    expect(recipe.sugar).equal('yes');
  });
});
