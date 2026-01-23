import * as fs from 'fs';

export const loadJsonFile = function (pathToFile: string): JSON {
  const file = fs.readFileSync(`${pathToFile}.json`, 'utf-8');
  return JSON.parse(file);
};

export const loadLocator = function (file: JSON, locator: string): string {
  let toReturn: string = '';

  for (const value of Object.values(file)) {
    for (const key of Object.keys(value)) {
      if (key === locator) {
        toReturn = value[key];
      }
    }
  }

  return toReturn;
};
