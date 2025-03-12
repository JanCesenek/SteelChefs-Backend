function isValidText(value, minLength = 2, maxLength = 30) {
  return (
    value &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength &&
    /^[a-zA-Z\s]+$/.test(value)
  );
}

function isValidStreet(value, minLength = 2, maxLength = 30) {
  return (
    value &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength &&
    /^[a-zA-Z0-9\s\/.]+$/.test(value)
  );
}

function isValidPostcode(value, minLength = 4, maxLength = 6) {
  return (
    value &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength &&
    /^[a-zA-Z0-9\s]+$/.test(value)
  );
}

function isValidEmail(value, minLength = 5, maxLength = 30) {
  return (
    value &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength &&
    /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/.test(value)
  );
}

function isValidPhone(value, minLength = 8, maxLength = 12) {
  return (
    value &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength &&
    /^[0-9\s]+$/.test(value)
  );
}

function isValidUsername(value, minLength = 6, maxLength = 16) {
  return (
    value &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value) &&
    /^[a-zA-Z0-9]+$/.test(value) &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength
  );
}

function isValidPassword(value, minLength = 8, maxLength = 16) {
  return (
    value &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[$&+,:;=?@#|'"<>.⌃*()%!-_]/.test(value)
  );
}

exports.isValidText = isValidText;
exports.isValidStreet = isValidStreet;
exports.isValidPostcode = isValidPostcode;
exports.isValidEmail = isValidEmail;
exports.isValidPhone = isValidPhone;
exports.isValidUsername = isValidUsername;
exports.isValidPassword = isValidPassword;
