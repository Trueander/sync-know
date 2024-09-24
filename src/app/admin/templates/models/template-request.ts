export class TemplateRequest {
  constructor(public title: string,
              public htmlContent: string,
              public teamsIds: number[]) {
  }
}
