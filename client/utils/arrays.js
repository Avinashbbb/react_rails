export const nTimes = (size, zeroIndex = false) => {
  const array = Array.from(Array(size).keys());

  if (!zeroIndex) {
    return array.map(index => index + 1);
  }

  return array;
};
