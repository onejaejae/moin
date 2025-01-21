import { validate } from 'class-validator';
import { IsPositiveInteger } from '../is-positive-integer.validator';

describe('IsPositiveInteger', () => {
  class TestClass {
    @IsPositiveInteger()
    value: number;

    constructor(value: number) {
      this.value = value;
    }
  }

  it('should pass validation for positive integers', async () => {
    const testCases = [1, 42, 100];

    for (const value of testCases) {
      const test = new TestClass(value);
      const errors = await validate(test);
      expect(errors.length).toBe(0);
    }
  });

  it('should fail validation for negative integers', async () => {
    const testCases = [-1, -42, -100];

    for (const value of testCases) {
      const test = new TestClass(value);
      const errors = await validate(test);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints?.isPositiveInteger).toBe('NEGATIVE_NUMBER');
    }
  });

  it('should fail validation for zero', async () => {
    const test = new TestClass(0);
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isPositiveInteger).toBe('NEGATIVE_NUMBER');
  });

  it('should fail validation for non-integer numbers', async () => {
    const testCases = [1.5, 2.7, -1.5];

    for (const value of testCases) {
      const test = new TestClass(value);
      const errors = await validate(test);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints?.isPositiveInteger).toBe('NEGATIVE_NUMBER');
    }
  });

  it('should fail validation for non-numeric values', async () => {
    const testCases = [null, undefined, '123', true, false];

    for (const value of testCases) {
      const test = new TestClass(value as any);
      const errors = await validate(test);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints?.isPositiveInteger).toBe('NEGATIVE_NUMBER');
    }
  });
});
