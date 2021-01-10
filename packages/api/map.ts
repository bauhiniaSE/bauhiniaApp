import { IObject } from './object';

export interface IPosition {
  position: {
    x: number;
    y: number;
    layer: number;
  };
}

export type IObjectOnMap = IObject & IPosition;

export interface IMap {
  id: string;

  height: number;
  width: number;

  tiles: IObjectOnMap[];
}
// Example
// const map: IMap = {
//   id: '',
//   height: 1,
//   width: 1,
//   tiles: [
//     {
//       id: 'string',
//       widthWE: 1,
//       widthNS: 2,
//       height: 1,

//       canPlaceOn: true,
//       material: {
//         albedo: 1,
//         density: 2,
//       },
//       position: {
//         x: 1,
//         y: 2,
//         layer: 3,
//       },
//     },
//   ],
// };
