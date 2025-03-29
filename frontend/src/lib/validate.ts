export const isValidHttpUrl = (url?: string) => {
  try {
    const newUrl = new URL(url!)
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:'
  } catch (error: unknown) {
    return 'URL must be a valid HTTP or HTTPS URL'
  }
}
