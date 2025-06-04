// src/utils/validatePassword.js

export const validatePassword = (password, passwordConfirm) => {
  return {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password === passwordConfirm,
  };
};

export const isFormValid = (email, password, passwordConfirm, passwordChecks) => {
  return (
    email &&
    password &&
    passwordConfirm &&
    Object.values(passwordChecks).every(Boolean)
  );
};