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
async function readFileAsDataURL(file: File) {
  const resultBase64 = await new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

  return resultBase64 as string;
}

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
          const file = t.files[0];
          const img = document.createElement('img');
          const canvas = document.createElement('canvas');
          const result = await readFileAsDataURL(file);
          img.src = result;

          let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          ctx.drawImage(img, 0, 0);

          canvas.width = 64;
          canvas.height = 64;
          ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          ctx.drawImage(img, 0, 0, 64, 64);

          values.image = canvas.toDataURL('image/png');

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

    const isPlant = createElement('input', {
      id: 'plant',
      type: 'number',
      oninput: (e) => {
        values.material.plant = +(e.target as HTMLInputElement).value === 1;
      },
      value: values.material.plant,
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
    editorHandle.appendChild(createLabel('plant', 'is it a plant (1 | 0)'));
    editorHandle.appendChild(isPlant);
    editorHandle.appendChild(saveTile);

    return editorHandle;
  }
}
