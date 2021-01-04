export type MapBuilder = new (context: CanvasRenderingContext2D) => IMapBuilder;

interface IMapBuilder {
  newMap(width: number, height: number): void;
  loadMap(id: string): void;
  saveMap(): void;
  saveToImage(): void;
}
