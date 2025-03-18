export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@_]+(\.[^\s@_]+)+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string) {
  const phoneRegex = /^[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}
