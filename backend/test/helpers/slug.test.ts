import assert from 'assert'

import { generateNextSlug } from '../../src/helpers/slug'

describe('generateNextSlug', () => {
  it('increments a simple slug', () => {
    assert.strictEqual(generateNextSlug('aaaaaa'), 'aaaaab')
  })

  it('handles rollover at the end', () => {
    assert.strictEqual(generateNextSlug('aaaaaz'), 'aaaaba')
  })

  it('expands slug when all characters are z', () => {
    assert.strictEqual(generateNextSlug('zzzzzz'), 'aaaaaaa')
  })

  it('increments a single character slug', () => {
    assert.strictEqual(generateNextSlug('a'), 'b')
  })

  it('converts a single z to aa', () => {
    assert.strictEqual(generateNextSlug('z'), 'aa')
  })

  it('increments two-letter slug with rollover', () => {
    assert.strictEqual(generateNextSlug('az'), 'ba')
  })

  it('returns "a" when input is an empty string', () => {
    assert.strictEqual(generateNextSlug(''), 'a')
  })

  it('increments a non-edge case string', () => {
    assert.strictEqual(generateNextSlug('abc'), 'abd')
  })

  it('handles internal rollover', () => {
    assert.strictEqual(generateNextSlug('abz'), 'aca')
  })

  it("increments multiple z's correctly", () => {
    assert.strictEqual(generateNextSlug('azz'), 'baa')
  })

  it('increments a slug with z in the middle', () => {
    assert.strictEqual(generateNextSlug('zaz'), 'zba')
  })

  it("rolls over multiple z's from the end", () => {
    assert.strictEqual(generateNextSlug('aaazzz'), 'aabaaa')
  })

  it('rolls over all but first letter', () => {
    assert.strictEqual(generateNextSlug('abzzz'), 'acaaa')
  })

  it('adds a prefix a when slug fully rolls over', () => {
    assert.strictEqual(generateNextSlug('zzzz'), 'aaaaa')
  })
})
