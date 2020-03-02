export interface Range {
  min: number;
  max: number;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (range: Range): number => {
  const ceilerMin = Math.ceil(range.min);
  const ceilerMax = Math.floor(range.max);
  return Math.floor(Math.random() * (ceilerMax - ceilerMin + 1)) + ceilerMin;
};

/**
 * Chiama getRandomInt() passando n range tra cui estrarre un unico numero
 */
export const getRandomIntFromRange = (...ranges: Range[]): number => {
  const results: number[] = [];
  ranges.forEach(range => results.push(getRandomInt(range)));
  return results[Math.floor(Math.random() * results.length)];
};

/**
 * Chiama getRandomIntFromRange() passando come range gli ascii dei valori alfanumerici,
 * restituendo un carattere casuale
 */
export const getRandomAlphaNumeric = (): string => {
  const numericRange: Range = { min: 48, max: 57 };
  const upperCaseRange: Range = { min: 65, max: 90 };
  const lowerCaseRange: Range = { min: 97, max: 122 };
  const randomASCII = getRandomIntFromRange(numericRange, upperCaseRange, lowerCaseRange);
  return String.fromCharCode(randomASCII);
};
