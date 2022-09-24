const redBlack = {
  BLACK: 0,
  RED: 1,
};
const redFields = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

const blackFields = [
  15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26,
];
export default {
  getRedBlackValue(value) {
    return redBlack[value];
  },

  enumToColor(number) {
    return Object.keys(redBlack).find((key) => redBlack[key] == number);
  },

  getFieldColor(number) {
    const parsedNumber = parseInt(number);
    if (blackFields.indexOf(parsedNumber) !== -1) {
      return "BLACK";
    } else if (redFields.indexOf(parsedNumber) !== -1) {
      return "RED";
    }
    return "GREEN";
  },
};
