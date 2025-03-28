export const generateNextSlug = (slug: string): string => {
  const chars = slug.split('')
  let i = chars.length - 1

  while (i >= 0) {
    if (chars[i] === 'z') {
      chars[i] = 'a'
      i--
    } else {
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1)
      return chars.join('')
    }
  }

  return 'a' + chars.join('')
}
