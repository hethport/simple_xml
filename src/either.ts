abstract class IEither<L, R> {

  abstract map<S>(f: (r: R) => S): IEither<L, S>;

  // noinspection JSUnusedGlobalSymbols
  abstract handle(f: (r: R) => void, g: (l: L) => void): void;
}

export class MyLeft<L> extends IEither<L, never> {
  constructor(public readonly value: L) {
    super();
  }

  override map<S>(): IEither<L, S> {
    return this;
  }

  override handle(f: (r: never) => void, g: (l: L) => void) {
    g(this.value);
  }
}

export class MyRight<R> extends IEither<never, R> {
  constructor(public readonly value: R) {
    super();
  }

  override map<S>(f: (r: R) => S): IEither<never, S> {
    return new MyRight(f(this.value));
  }

  override handle(f: (r: R) => void) {
    f(this.value);
  }
}

export type MyEither<L, R> = MyLeft<L> | MyRight<R>

