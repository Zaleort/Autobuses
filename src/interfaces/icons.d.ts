interface Icons {
  [key: string]: Icon
}

interface Icon {
  node: Function | VNode,
  viewBox: string,
}

interface IconObject {
  name: string,
  node: VNode,
  viewBox: string,
}
