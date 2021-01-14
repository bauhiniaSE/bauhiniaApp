interface IMapManager {
  listAllUserGames(userId: string): MyMap[];
  createNewGame(mapId: string): boolean;
  listAllMapsToPlay(): MyMap[];
  saveGame(userId: string, game: MyMap): void;
  getObjectHeight(objectId: string): number;


//================================================
  getObjectWidth(objectId: string): number;
  getObjectLength(objectId: string): number;
  getObjectPrice(objectId: string): number;
  getObjectType(objectId: string): string;
  startGame(gameId: string): void;
}
