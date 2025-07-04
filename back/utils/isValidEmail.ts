export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@_]+(\.[^\s@_]+)+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string) {
  const phoneRegex = /^[+,0-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

export const MAX_NAME_LENGTH = 40
export const MIN_LENGHT_PASSWORD = 6
