// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { compose } from 'recompose';

class RootCalculator {
  constructor() {
    this.initializer = 2;
  }

  add(a: number, b: number): number {
    return a + b;
  }

  returnVarParent() {
    return this.var;
  }

  return2(): number {
    return 2;
  }

  parentFunc() {
    return this.childFunc();
  }

  static staticFunc() {
    return 'hi';
  }
}

const addClass = SuperClass => class extends SuperClass {};

const withCalc2 = (SuperClass = class {}) =>
  class extends SuperClass {
    constructor() {
      super();
      this.initializer = this.initializer * 2;
    }

    increment(a: number): number {
      return a + 1;
    }

    setVar(value): void {
      this.var = value;
    }
  };

const withCalc3 = SuperClass =>
  class extends SuperClass {
    constructor() {
      super();
      this.initializer = this.initializer + 1;
    }

    multiply(a: number, b: number): number {
      return a * b;
    }

    returnVarChild(): void {
      return this.var;
    }

    return2(): number {
      return -2;
    }

    childFunc() {
      return 'it works';
    }
  };

const UberClass = compose(
  withCalc3,
  withCalc2,
)(RootCalculator);

describe('Class composition', () => {
  it('extends properly', () => {
    class MyClass extends RootCalculator {}

    expect(new MyClass().add(1, 2)).to.equal(3);
  });

  it('combines classes with the mixin', () => {
    const Calc2 = withCalc2();
    class MyClass extends addClass(Calc2) {}

    expect(new MyClass().increment(1)).to.equal(2);
  });

  it('combines multiple classes', () => {
    class MyClass extends withCalc3(withCalc2(RootCalculator)) {}

    expect(new MyClass().increment(1)).to.equal(2);
    expect(new MyClass().add(1, 2)).to.equal(3);
    expect(new MyClass().multiply(2, 3)).to.equal(6);
  });

  it('combines multiple classes with compose', () => {
    class MyClass extends compose(
      withCalc3,
      withCalc2,
    )(RootCalculator) {}

    expect(new MyClass().increment(1)).to.equal(2);
    expect(new MyClass().add(1, 2)).to.equal(3);
    expect(new MyClass().multiply(2, 3)).to.equal(6);
  });

  it('combines multiple classes with compose hidden away', () => {
    const MyClass = class extends UberClass {};

    expect(new MyClass().increment(1)).to.equal(2);
    expect(new MyClass().add(1, 2)).to.equal(3);
    expect(new MyClass().multiply(2, 3)).to.equal(6);
  });

  it('calls the constructor chain from Root to Calc3', () => {
    class MyClass extends UberClass {}

    expect(new MyClass().initializer).to.equal(5);
  });

  it('autocompletion works', () => {
    class MyClass extends compose(
      withCalc3,
      withCalc2,
    )(RootCalculator) {}

    const Calc = new MyClass();

    // Play around here..
  });

  it('can use instance variables across calculators', () => {
    class MyClass extends UberClass {}

    const Calc = new MyClass();

    expect(Calc.returnVarParent()).to.equal(undefined);
    expect(Calc.returnVarChild()).to.equal(undefined);

    Calc.setVar(2);

    expect(Calc.var).to.equal(2);
    expect(Calc.returnVarParent()).to.equal(2);
    expect(Calc.returnVarChild()).to.equal(2);
  });

  it('overwrites parent methods ', () => {
    class MyClass extends UberClass {
      add(a, b) {
        return a - b;
      }
    }

    expect(new MyClass().add(2, 3)).to.equal(-1);
  });

  it('overwrites in the right order', () => {
    expect(new UberClass().return2()).to.equal(-2);
  });

  it('can call super', () => {
    class MyClass extends UberClass {
      add = super.multiply;

      increment(a) {
        return super.increment(a - 1);
      }
    }

    expect(new MyClass().add(2, 3)).to.equal(6);
    expect(new MyClass().increment(2)).to.equal(2);
  });

  it('shows the right types with flow-type', () => {
    class MyClass extends UberClass {
      return2(): string {
        return '2';
      }

      returnNumber() {
        return super.return2();
      }
    }

    // Inspect types here to make sure they are correct
    expect(new MyClass().return2()).to.equal('2');
    expect(new MyClass().returnNumber()).to.equal(-2);
  });

  it('parent can call child funcs', () => {
    expect(new UberClass().parentFunc()).to.equal('it works');
  });

  it('does not inherit static methods as expected', () => {
    class MyClass extends UberClass {
      constructor(props) {
        super(props);
      }

      return2(): string {
        return '2';
      }

      static returnNumber() {
        return 5;
      }

      static returnNumber2 = () => 5;
    }

    const myClass = new MyClass();
    expect(myClass.returnNumber2).to.equal(undefined);
    expect(myClass.returnNumber).to.equal(undefined);
    expect(myClass.staticFunc).to.equal(undefined);
  });
});
