/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Direction, DirectionHandler } from './direction';
import { Facet } from './facet';

export class FacetList {
  public facets: Facet[] = [];

  public illuminateAndCrop(sunAngle: number, sunDirection: Direction) {
    let sunPower: number = 1000 * 60 * 60 * 8;

    this.facets.forEach((casting) => {
      if (DirectionHandler.areOpposite(casting.direction, sunDirection)) {
        let shadowLength: number = casting.height / Math.tan((sunAngle * Math.PI) / 180);
        let facetStorage: Facet[] = [];

        let counter: number = 0;
        this.facets.forEach((shadowed) => {
          if (!shadowed.shadowed && shadowed.direction == sunDirection) {
            switch (sunDirection) {
              case Direction.W:
                shadowLength *= -1;
              case Direction.E:
                if (
                  // eslint-disable-next-line prettier/prettier
                  Overlapper.checkOverlay(casting.y, casting.y + casting.width, shadowed.y, shadowed.y + shadowed.width) &&
                  Overlapper.checkOverlay(casting.x, casting.x - shadowLength, shadowed.x, shadowed.x)
                ) {
                  if (casting.y > shadowed.y) {
                    facetStorage.push(shadowed.getLowerYHalf(casting.y));
                    shadowed = shadowed.getUpperYHalf(casting.y);
                  }
                  if (casting.y + casting.width < shadowed.y + shadowed.width) {
                    facetStorage.push(shadowed.getUpperYHalf(casting.y + casting.width));
                    shadowed = shadowed.getLowerYHalf(casting.y + casting.width);
                  }
                  if (shadowed.width > 0) {
                    let distance: number = Math.abs(casting.x - shadowed.x);
                    let shadowHeight: number = casting.height - distance * Math.tan((sunAngle * Math.PI) / 180);
                    facetStorage.push(shadowed.getLowerZHalf(shadowHeight));
                    facetStorage.push(shadowed.getUpperZHalf(shadowHeight));
                    this.facets.splice(counter, 1);
                  }
                }
                break;
              case Direction.S:
                shadowLength *= -1;
              case Direction.N:
                if (
                  // eslint-disable-next-line prettier/prettier
                  Overlapper.checkOverlay(casting.x, casting.x + casting.width, shadowed.x, shadowed.x + shadowed.width) &&
                  Overlapper.checkOverlay(casting.y, casting.y - shadowLength, shadowed.y, shadowed.y)
                ) {
                  if (casting.x > shadowed.x) {
                    facetStorage.push(shadowed.getLowerXHalf(casting.x));
                    shadowed = shadowed.getUpperXHalf(casting.x);
                  }
                  if (casting.x + casting.width < shadowed.x + shadowed.width) {
                    facetStorage.push(shadowed.getUpperXHalf(casting.x + casting.width));
                    shadowed = shadowed.getLowerXHalf(casting.x + casting.width);
                  }
                  if (shadowed.width > 0) {
                    let distance: number = Math.abs(casting.y - shadowed.y);
                    let shadowHeight: number = casting.height - distance * Math.tan((sunAngle * Math.PI) / 180);
                    if (shadowHeight > shadowed.bottom) {
                      facetStorage.push(shadowed.getLowerZHalf(shadowHeight));
                      facetStorage.push(shadowed.getUpperZHalf(shadowHeight));
                      this.facets.splice(counter, 1);
                    }
                  }
                }
                break;
            }
          }
          counter++;
        });
        this.facets = this.facets.concat(facetStorage);
      }
    });

    this.facets.forEach((facet) => {
      let incidenceSin: number = 0;
      //let counter: number = 0;
      //console.log('trying to sin');
      if (!facet.shadowed) {
        if (facet.direction == Direction.TOP) {
          incidenceSin = Math.cos(((90 - sunAngle) * Math.PI) / 180);
        } else if (facet.direction == sunDirection) {
          incidenceSin = Math.cos((sunAngle * Math.PI) / 180);
          //console.log('sinning for ' + counter);
        }
        facet.temperature += (sunPower * (1 - facet.albedo) * incidenceSin) / (facet.density * facet.specificHeat);
      }
      //counter++;
    });
  }

  public addFacet(facet: Facet) {
    this.facets.push(facet);
  }

  public printAllFacets() {
    this.facets.forEach((facet) => {
      console.log(
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        facet.x.toLocaleString() +
          ', ' +
          facet.y.toLocaleString() +
          '; ' +
          facet.height.toLocaleString() +
          ', ' +
          facet.width.toLocaleString() +
          '; ' +
          facet.shadowed.toString()
      );
    });
  }
}

export class Overlapper {
  public Boundary: number;
  public inFirstFacet: boolean;

  constructor(Boundary: number, originalFacet: boolean) {
    this.Boundary = Boundary;
    this.inFirstFacet = originalFacet;
  }

  public static compare(a: Overlapper, b: Overlapper) {
    return a.Boundary - b.Boundary;
  }

  public static checkOverlay(
    firstLower: number,
    firstUpper: number,
    secondLower: number,
    secondUpper: number
  ): boolean {
    if (firstUpper == secondUpper || firstLower == secondLower) return true;
    let boundaries: Overlapper[] = [
      new Overlapper(firstLower, true),
      new Overlapper(firstUpper, true),
      new Overlapper(secondLower, false),
      new Overlapper(secondUpper, false),
    ];

    boundaries.sort(Overlapper.compare);
    return boundaries[0].inFirstFacet != boundaries[1].inFirstFacet;
  }
}
