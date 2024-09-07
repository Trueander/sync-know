
export class ContentRequest {
  constructor(public titulo: string,
              public htmlContent: string,
              public usuarioId: number,
              public padreId: number) {
  }
}
