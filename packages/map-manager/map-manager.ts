export { IMapManager } from './src/imap-manager';

import { MapRepository } from 'bauhinia-database-manager/map-repository';
import { TileRepository } from 'bauhinia-database-manager/tile-repository';
import { UserRepository } from 'bauhinia-database-manager/user-repository';

import { MapManager } from './src/map-manager';

const Manager = new MapManager(new TileRepository(), new MapRepository(), new UserRepository());

export { Manager };
