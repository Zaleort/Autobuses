import { VNode } from 'vue';

export interface Icons {
  [key: string]: Icon
}

export interface Icon {
  node: Function | VNode,
  viewBox: string,
}

export interface IconObject {
  name: string,
  node: VNode,
  viewBox: string,
}
