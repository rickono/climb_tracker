export const arrayToggle = <T>(array: T[], item: T): T[] => {
  return array.includes(item)
    ? array.filter((i) => i !== item)
    : [...array, item];
};

export const objectToggle = <T extends Object>(
  object: T,
  key: keyof T,
  value: T[keyof T]
): T => {
  if (key in object) {
    const newObject = { ...object };
    delete newObject[key];
    return newObject;
  } else {
    return { ...object, [key]: value };
  }
};
