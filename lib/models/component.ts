import {
  ButtonStyle,
  MessageComponentData,
  MessageComponentType,
  SelectOptionsData
} from '../types/index.ts';
import Client from '../client.ts';
import { Emoji } from './emoji.ts';

export class MessageComponent {
  client: Client;
  type: string;
  constructor(client: Client, data: MessageComponentData) {
    this.client = client;
    this.type = MessageComponentType[data.type];
  }
}

export class ActionRow extends MessageComponent{
  components: MessageComponent[];
  constructor(client: Client, data: MessageComponentData) {
    super(client, data);
    this.components = [];
    if (data.components) {
      for (const comp of data.components!) {
        switch (comp.type) {
          case 1:
            this.components.push(new ActionRow(client, comp));
            break;
          case 2:
            this.components.push(new Button(client, comp));
            break;
          case 3:
            this.components.push(new SelectMenu(client, comp));
            break;
        }
      }
    }
  }
}

export class Button extends MessageComponent {
  customID?: string;
  disabled?: boolean;
  style?: string;
  label?: string;
  emoji?: Emoji;
  url?: string;
  constructor(client: Client, data: MessageComponentData) {
    super(client, data);
    this.customID = data.custom_id;
    this.disabled = data.disabled;
    this.style = ButtonStyle[data.style];
    this.label = data.label;
    this.url = data.url;
    this.emoji = data.emoji ? new Emoji(client, data.emoji) : undefined;
  }
}

export class SelectMenu extends MessageComponent {
  customID?: string;
  disabled?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  minValues?: number;
  maxValues?: number
  constructor(client: Client, data: MessageComponentData) {
    super(client, data);
    this.customID = data.custom_id;
    this.disabled = data.disabled;
    this.options = [];
    this.placeholder = data.placeholder;
    this.minValues = data.min_values;
    this.maxValues = data.max_values;
  }
}

export class SelectOption {
  client: Client;
  label: string;
  value: string;
  description?: string;
  emoji?: Emoji;
  default?: boolean;
  constructor(client: Client, data: SelectOptionsData) {
    this.client = client;
    this.label = data.label;
    this.value = data.value;
    this.description = data.description;
    this.emoji = data.emoji ? new Emoji(client, data.emoji) : undefined;
    this.default = data.default;
  }
}