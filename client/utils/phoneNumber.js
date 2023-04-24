import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const formattedPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;

  const number = parsePhoneNumberFromString(`+1${phoneNumber}`);

  return number.formatNational();
};

