import { IMap } from 'bauhinia-api/map';
import { expect } from 'chai';

import { Bubble } from '../../src/bubble';
import { Direction } from '../../src/direction';
import { Facet } from '../../src/facet';
import { Simulator } from '../../src/simulator';
import { Parameters } from '../../src/technical-parameters';
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

  it('horizontal bubble heat trasfer - temp 30C', () => {
    const s: Simulator = new Simulator();
    const m: IMap = {
      id: '',
      height: 6 * Parameters.bubbleGrain,
      width: 6 * Parameters.bubbleGrain,
      tiles: [],
    };
    s.processMap(m);
    s.bubbles.bubbles[8].temperature = 30;
    s.bubbles.horizontalHeatTransfer();

    expect(s.bubbles.bubbles[8].temperature).greaterThan(s.bubbles.bubbles[7].temperature);
    expect(s.bubbles.bubbles[7].temperature).greaterThan(s.bubbles.bubbles[6].temperature);
    //expect(s.bubbles.bubbles[6].temperature).greaterThan(Weather.ambientTemp);

    expect(s.bubbles.bubbles[8].temperature).greaterThan(s.bubbles.bubbles[2].temperature);
    expect(s.bubbles.bubbles[2].temperature).greaterThan(s.bubbles.bubbles[1].temperature);
    expect(s.bubbles.bubbles[1].temperature).greaterThan(Weather.ambientTemp);

    expect(s.bubbles.bubbles[7].temperature).closeTo(s.bubbles.bubbles[9].temperature, 0.05);

    expect(s.bubbles.bubbles[0].temperature).equal(s.getTemperature(0, 0));
  });

  it('horizontal bubble heat trasfer - temp 40C', () => {
    const s: Simulator = new Simulator();
    const m: IMap = {
      id: '',
      height: 6 * Parameters.bubbleGrain,
      width: 6 * Parameters.bubbleGrain,
      tiles: [],
    };
    s.processMap(m);
    s.bubbles.bubbles[8].temperature = 40;
    s.bubbles.horizontalHeatTransfer();

    expect(s.bubbles.bubbles[8].temperature).greaterThan(s.bubbles.bubbles[7].temperature);
    expect(s.bubbles.bubbles[7].temperature).greaterThan(s.bubbles.bubbles[6].temperature);
    expect(s.bubbles.bubbles[6].temperature).greaterThan(Weather.ambientTemp);

    expect(s.bubbles.bubbles[8].temperature).greaterThan(s.bubbles.bubbles[2].temperature);
    expect(s.bubbles.bubbles[2].temperature).greaterThan(s.bubbles.bubbles[1].temperature);
    expect(s.bubbles.bubbles[1].temperature).greaterThan(Weather.ambientTemp);

    expect(s.bubbles.bubbles[7].temperature).closeTo(s.bubbles.bubbles[9].temperature, 0.05);

    expect(s.bubbles.bubbles[8].temperature).equal(s.getTemperature(125, 60));
  });
});
