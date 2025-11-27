import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator';

/**
 * Generates a random name in the format "adjective-noun"
 *
 * @returns A randomly generated name string
 * @throws {Error} If name generation fails
 */
export function generateName(): string {
  try {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2,
    });
  } catch (error) {
    throw new Error('Failed to generate name', { cause: error });
  }
}
