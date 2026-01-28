import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonData = Record<string, any>;

export const loadJsonFile = function (pathToFile: string): JsonData {
  const file = fs.readFileSync(`${pathToFile}.json`, 'utf-8');
  return JSON.parse(file);
};

export const loadLocator = function (file: JsonData, locator: string): string {
  for (const value of Object.values(file)) {
    if (value && typeof value === 'object' && locator in value) {
      return value[locator];
    }
  }
  return '';
};
