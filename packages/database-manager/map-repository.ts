import { IMap } from 'bauhinia-api/map';

export interface IMapRepository {
  getAllBlueprints(): Promise<IMap[]>;
  addMap(map: IMap): Promise<boolean>;
  removeMap(id: string, login: string): Promise<boolean>;
  getMap(id: string, login: string): Promise<IMap>;
  updateMap(map: IMap): Promise<boolean>;
  getAllUserMaps(login: string): Promise<IMap[]>;
  getAllUserMapsIds(login: string): Promise<string[]>;
  terminate(): void;
}
