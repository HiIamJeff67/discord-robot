export const alignNumberString = function (
  numberString: string,
  alignLength: number,
): string {
  while (numberString.length < alignLength) numberString = '0' + numberString;
  return numberString;
};
