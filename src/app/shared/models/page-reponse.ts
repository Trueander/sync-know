export class PageReponse<T> {
  constructor(public items: T[],
              public totalElements: number) {

  }
}
