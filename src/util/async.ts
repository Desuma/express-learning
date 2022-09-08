export class Defer<T = any> {
  public promise: Promise<T>;
  public resolve!: (value: T | PromiseLike<T>) => void;
  public reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export const createDefer = <T = any>() => new Defer<T>();

/**
 * 延时等待。默认 1s
 */
export const delay = (time: number = 1000) => {
  const dfd = createDefer();

  setTimeout(dfd.resolve, time);

  return dfd.promise;
}