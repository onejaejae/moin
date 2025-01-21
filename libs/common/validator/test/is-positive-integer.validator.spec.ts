import { validateSync } from 'class-validator';
import { NegativeNumberException } from 'src/core/exception/negativeNumber.exception';
import { IsPositiveInteger } from '../is-positive-integer.validator';

class TestClass {
  @IsPositiveInteger()
  value: number | undefined | null;
}

describe('IsPositiveInteger', () => {
  let testClass: TestClass;

  beforeEach(() => {
    testClass = new TestClass();
  });

  it('양의 정수일 경우 유효성 검사를 통과해야 한다', () => {
    testClass.value = 1;
    expect(() => validateSync(testClass)).not.toThrow();

    testClass.value = 100;
    expect(() => validateSync(testClass)).not.toThrow();
  });

  it('음수일 경우 NegativeNumberException을 발생시켜야 한다', () => {
    testClass.value = -1;
    expect(() => validateSync(testClass)).toThrow(NegativeNumberException);

    testClass.value = -100;
    expect(() => validateSync(testClass)).toThrow(NegativeNumberException);
  });

  it('0일 경우 NegativeNumberException을 발생시켜야 한다', () => {
    testClass.value = 0;
    expect(() => validateSync(testClass)).toThrow(NegativeNumberException);
  });

  it('소수일 경우 NegativeNumberException을 발생시켜야 한다', () => {
    testClass.value = 1.5;
    expect(() => validateSync(testClass)).toThrow(NegativeNumberException);

    testClass.value = 0.1;
    expect(() => validateSync(testClass)).toThrow(NegativeNumberException);
  });

  it('숫자가 아닌 값일 경우 NegativeNumberException을 발생시켜야 한다', () => {
    testClass.value = null;
    expect(() => validateSync(testClass)).toThrow(NegativeNumberException);

    testClass.value = undefined;
    expect(() => validateSync(testClass)).toThrow(NegativeNumberException);

    testClass.value = 'string' as any;
    expect(() => validateSync(testClass)).toThrow(NegativeNumberException);
  });
});
