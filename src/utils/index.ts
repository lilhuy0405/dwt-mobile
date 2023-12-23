import Toast from 'react-native-simple-toast';

export const validateEmail = (email: string) => {
  return String(email.trim())
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const validatePhone = (phone: string): boolean => {
  const phoneNumberRegex = /^(0|84)\d{9,10}$/;
  return phoneNumberRegex.test(phone);
};

export const showToast = (message: string) => {
  return Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
};

export const padStart = (
  inputString: string,
  targetLength: number,
  padCharacter: string,
) => {
  // Convert inputString to a string if it's not already
  inputString = String(inputString);

  // If the input string is already longer than the target length, return it as is
  if (inputString.length >= targetLength) {
    return inputString;
  }

  // Calculate the number of characters to pad
  const padCount = targetLength - inputString.length;

  // Create a string of padCharacter repeated padCount times
  const padding = padCharacter.repeat(padCount);

  // Concatenate the padding with the input string
  const paddedString = padding + inputString;

  return paddedString;
};

export const capitalizeWords = (sentence: string) => {
  return sentence
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
