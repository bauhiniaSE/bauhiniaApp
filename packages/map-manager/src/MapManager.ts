class MapManager implements IMapManager {

  private readonly objectRepository: IObjectRepository;
  private readonly mapRepository: IMapRepository;

  public listAllUserGames(userId: string): MyMap[] {
    throw new Error('Method not implemented.');
  }
  public createNewGame(mapId: string): boolean {
    throw new Error('Method not implemented.');
  }
  public listAllMapsToPlay(): MyMap[] {
    throw new Error('Method not implemented.');
  }
  public saveGame(userId: string, game: MyMap): void {
    throw new Error('Method not implemented.');
  }

//==============================================================
  public getObjectHeight(objectId: string): number {
    throw new Error('Method not implemented.');
  }
  public getObjectWidth(objectId: string): number {
    throw new Error('Method not implemented.');
  }
  public getObjectLength(objectId: string): number {
    throw new Error('Method not implemented.');
  }
  public getObjectPrice(objectId: string): number {
    throw new Error('Method not implemented.');
  }
  public getObjectType(objectId: string): string {
    throw new Error('Method not implemented.');
  }
  public startGame(gameId: string): void {
    throw new Error('Method not implemented.');
  }
}
