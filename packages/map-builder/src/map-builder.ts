import {
  MapRepository as MapRepositoryFactory,
  uuidv4,
  Map as MapClass,
} from 'bauhinia-database-manager/map-repository';

import { TileRepository as TileRepositoryFactory } from 'bauhinia-database-manager/tile-repository';

import { IMap } from 'bauhinia-api/map';
import { Item } from 'bauhinia-database-manager/src/tile-repository';

const MapRepository = new MapRepositoryFactory();
const TileRepository = new TileRepositoryFactory();
const tileSize = 64;

export class Camera {
  public static SPEED = 256;

  public x: number = 0;
  public y: number = 0;
  private readonly maxX: number;
  private readonly maxY: number;

  constructor(map: IMap, public readonly width: number, public readonly height: number) {
    this.maxX = tileSize * map.width - width;
    this.maxY = tileSize * map.height - height;
  }

  public move(delta: number, dirx: number, diry: number) {
    // move camera
    this.x += dirx * Camera.SPEED * delta;
    this.y += diry * Camera.SPEED * delta;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }
}

export class ImageLoader {
  private readonly images: Record<string, HTMLImageElement> = {};

  public loadImages(images: Array<[string, string]>) {
    images.forEach((image) => this.loadImage(image[0], image[1]));
  }

  public loadImage(key: string, image: string) {
    const img = new Image();
    img.src = image;
    this.images[key] = img;
  }

  public getImage(key: string) {
    return key in this.images ? this.images[key] : null;
  }
}

export enum KEYS {
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
}

export class Keyboard {
  private readonly keys: Record<string, boolean> = {};

  public isDown(keyCode: string) {
    if (!(keyCode in this.keys)) {
      throw new Error(`Keycode ${keyCode} is not being listened to`);
    }
    return this.keys[keyCode];
  }

  public listenForEvents(keys: string[]) {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));

    keys.forEach((key) => {
      this.keys[key] = false;
    });
  }

  private keyEvent(event: KeyboardEvent, bool: boolean) {
    const keyCode = event.key;

    if (keyCode in this.keys) {
      event.preventDefault();
      this.keys[keyCode] = bool;
    }
  }
  private onKeyDown(event: KeyboardEvent) {
    this.keyEvent(event, true);
  }
  private onKeyUp(event: KeyboardEvent) {
    this.keyEvent(event, false);
  }
}

export class MapBuilder {
  private readonly context: CanvasRenderingContext2D;
  private readonly keyboard = new Keyboard();
  private camera?: Camera;
  private readonly imageLoader: ImageLoader = new ImageLoader();
  private Map?: IMap;
  private initialized = false;
  private hasScrolled = true;
  private previousElapsed: number = 0;

  public tiles?: Item[];
  public selectedTile: string = '';

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (context) {
      this.context = context;
    } else {
      throw new Error('Your browser does not support canvas');
    }
  }

  public async newBlueprint() {
    this.Map = new MapClass();
    this.Map.id = uuidv4();
    await this.initialize();
  }
  public async editBlueprint(id: string) {
    const temp = await MapRepository.getMap(id, '');
    if (temp === 400) {
      console.log('map not found');
    } else {
      this.Map = temp;
      await this.initialize();
    }
  }

  public async newMap(id: string) {
    const temp = await MapRepository.getMap(id, '');
    if (temp === 400) {
      console.log('map not found');
    } else {
      this.Map = temp;
      this.Map.id = uuidv4();
      this.Map.login = 'user';
      this.Map.isBlueprint = false;
      await this.initialize();
    }
  }
  public async editMap(id: string) {
    const temp = await MapRepository.getMap(id, 'user');
    if (temp === 400) {
      console.log('map not found');
    } else {
      this.Map = temp;
      await this.initialize();
    }
  }

  public save() {
    if (this.Map) {
      MapRepository.updateMap(this.Map);
    }
  }

  public getMap() {
    return this.Map;
  }
  public toDataURL() {
    return this.canvas.toDataURL();
  }

  private mouseEvent(e: MouseEvent) {
    if (!this.camera) {
      throw new Error('Camera does not exist');
    }
    const startCol = Math.floor(this.camera.x / tileSize);
    const startRow = Math.floor(this.camera.y / tileSize);
    const offsetX = -this.camera.x + startCol * tileSize;
    const offsetY = -this.camera.y + startRow * tileSize;

    const x = (e.x - tileSize / 2 - offsetX) / tileSize + startCol;
    const y = (e.y - tileSize / 2 - offsetY) / tileSize + startRow;
    const t = this.tiles?.find((el) => el.id === this.selectedTile) as Item;

    this.Map?.tiles.push({
      ...t,
      material: {
        albedo: t.material.albedo,
        density: t.material.density,
      },
      position: {
        x: Math.round(x),
        y: Math.round(y),
        layer: 0,
      },
    });
    this.render();
  }

  private async initialize() {
    if (this.Map && !this.initialized) {
      this.keyboard.listenForEvents([KEYS.LEFT, KEYS.RIGHT, KEYS.UP, KEYS.DOWN]);
      this.camera = new Camera(this.Map, this.canvas.width, this.canvas.height);
      this.tiles = await TileRepository.getAllTiles();
      this.imageLoader.loadImages(this.tiles.map((item) => [item.id, item.image]));
      this.canvas.onclick = this.mouseEvent.bind(this);
      this.render();
      this.initialized = true;
      window.requestAnimationFrame(this.tick.bind(this));
    }
  }

  private tick(elapsed: number) {
    if (!this.context) {
      throw new Error('Canvas has been removed');
    }
    window.requestAnimationFrame(this.tick.bind(this));

    // compute delta time in seconds -- also cap it
    const delta = Math.min((elapsed - this.previousElapsed) / 1000, 0.25);
    this.previousElapsed = elapsed;

    this.update(delta);

    // re-draw map if there has been scroll
    if (this.hasScrolled) {
      this.render();
    }
  }

  private update(delta: number) {
    if (!this.camera) {
      throw new Error('Camera does not exist');
    }
    this.hasScrolled = false;
    // handle camera movement with arrow keys
    let dirx = 0;
    let diry = 0;
    if (this.keyboard.isDown(KEYS.LEFT)) {
      dirx = -1;
    }
    if (this.keyboard.isDown(KEYS.RIGHT)) {
      dirx = 1;
    }
    if (this.keyboard.isDown(KEYS.UP)) {
      diry = -1;
    }
    if (this.keyboard.isDown(KEYS.DOWN)) {
      diry = 1;
    }

    if (dirx !== 0 || diry !== 0) {
      this.camera.move(delta, dirx, diry);
      this.hasScrolled = true;
    }
  }

  private render() {
    if (!this.context) {
      throw new Error('Canvas has been removed');
    }
    if (!this.camera) {
      throw new Error('Camera does not exist');
    }
    if (!this.Map) {
      throw new Error('Map does not exist');
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const startCol = Math.floor(this.camera.x / tileSize);
    const endCol = startCol + this.camera.width / tileSize;
    const startRow = Math.floor(this.camera.y / tileSize);
    const endRow = startRow + this.camera.height / tileSize;
    const offsetX = -this.camera.x + startCol * tileSize;
    const offsetY = -this.camera.y + startRow * tileSize;
    this.Map.tiles.forEach((tile) => {
      if (
        tile.position.x >= startCol &&
        tile.position.x <= endCol &&
        tile.position.y >= startRow &&
        tile.position.y <= endRow
      ) {
        const x = (tile.position.x - startCol) * tileSize + offsetX;
        const y = (tile.position.y - startRow) * tileSize + offsetY;
        this.context.drawImage(
          this.imageLoader.getImage(tile.id) as HTMLImageElement, // image
          Math.round(x),
          Math.round(y),
          tileSize,
          tileSize
        );
      }
    });
  }
}
