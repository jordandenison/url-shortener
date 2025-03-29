import { parseISO } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'

const formatDate = (utcDateString: string, dateFormat: string = 'MMMM d, yyyy h:mm a') => {
  const date = parseISO(utcDateString)
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const zonedDate = utcToZonedTime(date, userTimeZone)
  return format(zonedDate, dateFormat, { timeZone: userTimeZone })
}

export const formatDateShort = (utcDateString: string) => formatDate(utcDateString, 'MMM d, h:mm a')
