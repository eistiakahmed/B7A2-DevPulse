import { ValidationRule, ValidationResult } from '../types';

export class Validator {
  private errors: string[] = [];

  required(value: any, fieldName: string): this {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      this.errors.push(`${fieldName} is required`);
    }
    return this;
  }

  minLength(value: string, fieldName: string, min: number): this {
    if (value && value.length < min) {
      this.errors.push(`${fieldName} must be at least ${min} characters`);
    }
    return this;
  }

  maxLength(value: string, fieldName: string, max: number): this {
    if (value && value.length > max) {
      this.errors.push(`${fieldName} must not exceed ${max} characters`);
    }
    return this;
  }

  email(value: string, fieldName: string = 'Email'): this {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.errors.push(`${fieldName} must be a valid email address`);
    }
    return this;
  }

  enum<T extends string>(value: string, validValues: T[], fieldName: string): this {
    if (value && !validValues.includes(value as T)) {
      this.errors.push(`${fieldName} must be one of: ${validValues.join(', ')}`);
    }
    return this;
  }

  pattern(value: string, regex: RegExp, fieldName: string, message?: string): this {
    if (value && !regex.test(value)) {
      this.errors.push(message || `${fieldName} format is invalid`);
    }
    return this;
  }

  getResult(): ValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: this.errors
    };
  }

  static merge(...results: ValidationResult[]): ValidationResult {
    const allErrors = results.flatMap(r => r.errors);
    return {
      valid: allErrors.length === 0,
      errors: allErrors
    };
  }
}

export const validateRequest = (rules: ValidationRule[], data: any): ValidationResult => {
  const validator = new Validator();

  for (const rule of rules) {
    const value = data[rule.field];

    if (rule.required) {
      validator.required(value, rule.field);
    }

    if (value && rule.minLength) {
      validator.minLength(value, rule.field, rule.minLength);
    }

    if (value && rule.maxLength) {
      validator.maxLength(value, rule.field, rule.maxLength);
    }

    if (value && rule.email) {
      validator.email(value, rule.field);
    }

    if (value && rule.enum) {
      validator.enum(value, rule.enum, rule.field);
    }
  }

  return validator.getResult();
};
