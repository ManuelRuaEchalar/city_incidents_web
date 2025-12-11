/**
 * Composable for date formatting utilities
 */
export function useFormatDate() {
  /**
   * Format a date string to a readable format
   * @param dateString - ISO date string
   * @returns Formatted date string (DD/MM/YYYY HH:MM)
   */
  function formatDateTime(dateString: string): string {
    const date = new Date(dateString)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  /**
   * Format a date string to short format
   * @param dateString - ISO date string
   * @returns Formatted date string (DD/MM HH:MM)
   */
  function formatShortDateTime(dateString: string): string {
    const date = new Date(dateString)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}/${month} ${hours}:${minutes}`
  }

  /**
   * Format a date string to date only
   * @param dateString - ISO date string
   * @returns Formatted date string (DD/MM/YYYY)
   */
  function formatDate(dateString: string): string {
    const date = new Date(dateString)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  /**
   * Format a date to relative time (e.g., "hace 2 horas")
   * @param dateString - ISO date string
   * @returns Relative time string
   */
  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSeconds < 60) {
      return 'Hace un momento'
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
    } else {
      return formatDate(dateString)
    }
  }

  return {
    formatDateTime,
    formatShortDateTime,
    formatDate,
    formatRelativeTime,
  }
}
