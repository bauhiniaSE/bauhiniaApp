import { uuidv4 } from 'bauhinia-database-manager/map-repository';

import { TileRepository as TileRepositoryFactory } from 'bauhinia-database-manager/tile-repository';

import { Item } from 'bauhinia-database-manager/src/tile-repository';

const TileRepository = new TileRepositoryFactory();

interface CreateElementOptions {
  classes?: string[];
  id?: string;
  type?: string;
  value?: any;
  src?: string;
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
  if (options.src) {
    (element as HTMLImageElement).src = options.src;
  }
  if (options.value) {
    (element as HTMLInputElement).value = options.value;
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

function createLabel(label: string, text: string) {
  const element = document.createElement('label');
  element.setAttribute('for', label);
  element.innerText = text;
  return element;
}

const toBase64 = (file: File) =>
  new Promise((resolve: (value: string) => void, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export class ObjectEditor {
  private tile?: Item;
  public selectedTile = '';

  constructor(private readonly parent: HTMLElement) {}

  public async newTile() {
    this.tile = new Item();
    this.tile.id = uuidv4();
    this.parent.appendChild(this.getEditor(this.tile));
  }
  public async editTile() {
    const temp = await TileRepository.getTile(this.selectedTile);
    if (temp === 400) {
      console.log('not found');
    } else {
      this.tile = temp;
      this.parent.appendChild(this.getEditor(this.tile));
    }
  }
  public async removeTile() {
    console.log('removing');
    console.log('removed with status: ', await TileRepository.removeTile(this.selectedTile));
  }
  private async saveTile() {
    if (this.tile) {
      TileRepository.updateTile(this.tile);
    }
  }

  private getEditor(values: Item) {
    this.parent.children[0]?.remove();
    const editorHandle = createElement('div', { id: 'editorHandle' });
    const imageViewer = createElement('img', {
      id: 'img_view',
      src: values.image,
    });
    const imageHandler = createElement('input', {
      id: 'image',
      type: 'file',
      onchange: async (e) => {
        const t = e.target as HTMLInputElement;
        if (t.files) {
          values.image = await toBase64(t.files[0]);

          imageViewer.src = values.image;
        }
      },
      value: values.image,
    });
    const widthWEHandler = createElement('input', {
      id: 'widthWE',
      type: 'number',
      oninput: (e) => {
        values.widthWE = +(e.target as HTMLInputElement).value;
      },
      value: values.widthWE,
    });
    const widthNSHandler = createElement('input', {
      id: 'widthNS',
      type: 'number',
      oninput: (e) => {
        values.widthNS = +(e.target as HTMLInputElement).value;
      },
      value: values.widthNS,
    });
    const materialAlbedoHandler = createElement('input', {
      id: 'albedo',
      type: 'number',
      oninput: (e) => {
        values.material.albedo = +(e.target as HTMLInputElement).value / 100;
      },
      value: values.material.albedo * 100,
    });
    const materialDensityHandler = createElement('input', {
      id: 'density',
      type: 'number',
      oninput: (e) => {
        values.material.density = +(e.target as HTMLInputElement).value;
      },
      value: values.material.density,
    });
    const priceHandler = createElement('input', {
      id: 'price',
      type: 'number',
      oninput: (e) => {
        values.price = +(e.target as HTMLInputElement).value;
      },
      value: values.price,
    });

    const saveTile = createElement('input', {
      type: 'button',
      classes: ['submit_btn'],
      onclick: this.saveTile.bind(this),
      value: 'Add',
    });

    editorHandle.appendChild(createLabel('image', 'Upload an object representation picture: '));
    editorHandle.appendChild(imageHandler);
    editorHandle.appendChild(imageViewer);
    editorHandle.appendChild(createLabel('width', 'width'));
    editorHandle.appendChild(widthWEHandler);
    editorHandle.appendChild(createLabel('height', 'height'));
    editorHandle.appendChild(widthNSHandler);
    editorHandle.appendChild(createLabel('albedo', 'albedo %'));
    editorHandle.appendChild(materialAlbedoHandler);
    editorHandle.appendChild(createLabel('density', 'density'));
    editorHandle.appendChild(materialDensityHandler);
    editorHandle.appendChild(createLabel('price', 'price'));
    editorHandle.appendChild(priceHandler);
    editorHandle.appendChild(saveTile);

    return editorHandle;
  }
}
