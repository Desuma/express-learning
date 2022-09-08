export class Hijacker<T = any> {
  protected treasure: T;

  constructor() {
    this.treasure = null as unknown as T;
  }

  public hijack(treasure: T) {
    this.treasure = treasure;
  }

  public get(): T {
    return this.treasure;
  };
}

export const createHijacker = <T = any>(): Hijacker<T> => new Hijacker<T>();