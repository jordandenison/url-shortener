export const extractErrorMessage = (e: unknown): string => {
  const err = e as any // eslint-disable-line @typescript-eslint/no-explicit-any

  if (Array.isArray(err?.data)) {
    return err.data.map((d: any) => d.message).join('; ') // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  return err?.message || 'An unknown error occurred'
}
