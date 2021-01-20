import { IMap } from 'bauhinia-api/map';

export interface IMapRepository {
  getAllBlueprints(): Promise<IMap[]>;
  removeMap(id: string, login: string): Promise<number>;
  getMap(id: string, login: string): Promise<IMap | number>;
  updateMap(map: IMap): Promise<number>;
  getAllUserMaps(login: string): Promise<IMap[]>;
  getAllUserMapsIds(login: string): Promise<string[]>;
  terminate(): void;
}

export { MapRepository, uuidv4, Map } from './src/map-repository';
