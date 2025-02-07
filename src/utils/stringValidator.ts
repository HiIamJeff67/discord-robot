export const isLowerEnglishLetter = function (letter: string): boolean {
  return letter >= 'a' && letter <= 'z';
};

export const isUpperEnglishLetter = function (letter: string): boolean {
  return letter >= 'A' && letter <= 'Z';
};

export const containOnlyEnglishLetters = function (str: string): boolean {
  for (const l of str) {
    if (!isLowerEnglishLetter(l) && !isUpperEnglishLetter(l)) return false;
  }
  return true;
};

export const isNumberCharacter = function (chr: string): boolean {
  return chr.length == 1 && chr >= '0' && chr <= '9';
};

export const isNumberString = function (str: string): boolean {
  for (const l of str) {
    if (!isNumberCharacter(l)) return false;
  }
  return true;
};

export const isEmail = function (str: string): boolean {
  return str.includes('@') && str.includes('.');
};
