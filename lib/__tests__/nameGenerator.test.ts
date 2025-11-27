import { describe, it, expect } from 'vitest';
import { generateName } from '../nameGenerator';

describe('nameGenerator', () => {
  it('should generate a name', () => {
    const name = generateName();
    expect(name).toBeTruthy();
    expect(typeof name).toBe('string');
  });

  it('should generate names in adjective-noun format', () => {
    const name = generateName();
    const parts = name.split('-');
    expect(parts.length).toBe(2);
  });

  it('should generate different names on multiple calls', () => {
    const names = new Set();
    for (let i = 0; i < 10; i++) {
      names.add(generateName());
    }
    // Should have some variety (at least 2 different names)
    expect(names.size).toBeGreaterThan(1);
  });
});
