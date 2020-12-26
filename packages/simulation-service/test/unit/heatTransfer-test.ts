import { expect } from 'chai';

import { Bubble } from '../../src/bubble';
import { Direction } from '../../src/direction';
import { Facet } from '../../src/facet';
import { Weather } from '../../src/weather-constants';

describe('test', () => {
  it('facet heat transer', () => {
    const f: Facet = new Facet(0, 10, 200, 100, Direction.S);
    const b: Bubble = new Bubble(200, 200, 200);
    f.assignBubble(b);
    f.temperature = 30;

    expect(b.temperature).equal(Weather.ambientTemp);

    f.transferHeat();
    expect(b.temperature).greaterThan(Weather.ambientTemp);
    //console.log(b.temperature);
  });
});
