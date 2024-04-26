export default class Error {
  constructor(
    public message: string,
    public args?: Record<string, string>,
  ) {}
}
