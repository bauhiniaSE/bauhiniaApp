import { expect } from 'chai';

import { Bubble } from '../../src/bubble';
import { Direction } from '../../src/direction';
import { Facet } from '../../src/facet';
//import { Simulator } from '../../src/simulator';
import { Weather } from '../../src/weather-constants';

describe('heat transfer - test', () => {
  it('facet heat transer', () => {
    const f: Facet = new Facet(0, 10, 200, 100, Direction.S);
    const b: Bubble = new Bubble();
    f.assignBubble(b);
    f.temperature = 30;

    expect(b.temperature).equal(Weather.ambientTemp);

    f.transferHeat();
    expect(b.temperature).greaterThan(Weather.ambientTemp);
  });
});
