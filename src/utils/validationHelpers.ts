import { Validator } from './validators';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const validator = new Validator();

  validator
    .minLength(password, 'Password', 8)
    .pattern(password, /[A-Z]/, 'Password', 'Password must contain at least one uppercase letter')
    .pattern(password, /[a-z]/, 'Password', 'Password must contain at least one lowercase letter')
    .pattern(password, /[0-9]/, 'Password', 'Password must contain at least one number');

  return validator.getResult();
};
