import { uuidv4 } from 'bauhinia-database-manager/map-repository';

import { TileRepository as TileRepositoryFactory } from 'bauhinia-database-manager/tile-repository';

import { Item } from 'bauhinia-database-manager/src/tile-repository';

const TileRepository = new TileRepositoryFactory();

interface CreateElementOptions {
  classes?: string[];
  id?: string;
  type?: string;
  value?: any;
  onclick?: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  oninput?: (this: GlobalEventHandlers, ev: Event) => any;
  onchange?: (this: GlobalEventHandlers, ev: Event) => any;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: CreateElementOptions = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options.classes) {
    element.classList.add(...options.classes);
  }
  if (options.id) {
    element.id = options.id;
  }
  if (options.type) {
    (element as HTMLInputElement).type = options.type;
  }
  if (options.onclick) {
    element.onclick = options.onclick;
  }
  if (options.oninput) {
    element.oninput = options.oninput;
  }
  if (options.onchange) {
    element.onchange = options.onchange;
  }

  return element;
}

export class ObjectEditor {
  private tile?: Item;
  constructor(private readonly parent: HTMLElement) {}

  public async newTile() {
    this.tile = new Item();
    this.tile.id = uuidv4();
    this.parent.appendChild(this.getEditor(this.tile));
  }
  public async editTile(id: string) {
    const temp = await TileRepository.getTile(id);
    if (temp === 400) {
      console.log('not found');
    } else {
      this.tile = temp;
      this.parent.appendChild(this.getEditor(this.tile));
    }
  }
  private async saveTile() {
    if (this.tile) {
      TileRepository.updateTile(this.tile);
    }
  }

  private getEditor(values: Item) {
    const editorHandle = createElement('div', { id: 'editorHandle' });
    const imageHandler = createElement('input', { type: 'file', onchange: () => {}, value: values.image });
    const widthWEHandler = createElement('input', { type: 'number', oninput: () => {}, value: values.widthWE });
    const widthNSHandler = createElement('input', { type: 'number', oninput: () => {}, value: values.widthNS });
    const materialAlbedoHandler = createElement('input', {
      type: 'number',
      oninput: () => {},
      value: values.material.albedo,
    });
    const materialDensityHandler = createElement('input', {
      type: 'number',
      oninput: () => {},
      value: values.material.density,
    });
    const priceHandler = createElement('input', { type: 'number', oninput: () => {}, value: values.price });

    const saveTile = createElement('button', { classes: ['button', 'saveTile'], onclick: this.saveTile.bind(this) });

    editorHandle.appendChild(imageHandler);
    editorHandle.appendChild(widthWEHandler);
    editorHandle.appendChild(widthNSHandler);
    editorHandle.appendChild(materialAlbedoHandler);
    editorHandle.appendChild(materialDensityHandler);
    editorHandle.appendChild(priceHandler);
    editorHandle.appendChild(saveTile);

    return editorHandle;
  }
}
