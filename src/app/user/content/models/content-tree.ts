export class ContentTree {
  constructor(public id: number,
              public key: string,
              public label: string,
              public children: ContentTree[]) {
  }
}
