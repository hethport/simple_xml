abstract class IEither<L, R> {

  abstract map<S>(f: ((r: R) => S)): IEither<L, S>;

}

export class MyLeft<L> extends IEither<L, never> {
  constructor(public readonly value: L) {
    super();
  }

  override map<S>(): IEither<L, S> {
    return this;
  }
}

export class MyRight<R> extends IEither<never, R> {
  constructor(public readonly value: R) {
    super();
  }

  override map<S>(f: (r: R) => S): IEither<never, S> {
    return new MyRight(f(this.value));
  }
}

export type MyEither<L, R> = MyLeft<L> | MyRight<R>

