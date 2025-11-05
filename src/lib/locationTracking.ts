/**
 * Location & IP Tracking for RFQ Submissions
 * Detects user location, IP address, and country
 */

export interface LocationData {
  ip: string
  city: string
  state: string
  country: string
  countryCode: string
  isUSA: boolean
  timezone: string
  latitude: number
  longitude: number
  isp: string
}

/**
 * Get user's location and IP information using ipapi.co (free API)
 */
export const getUserLocation = async (): Promise<LocationData | null> => {
  try {
    // Use ipapi.co free API (1000 requests/day limit)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }

    const data = await response.json()

    // Check if we got valid data (not rate limited)
    if (data.error) {
      console.warn('IP API Error:', data.reason)
      return getFallbackLocation()
    }

    const locationData: LocationData = {
      ip: data.ip || 'Unknown',
      city: data.city || 'Unknown',
      state: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      isUSA: data.country_code === 'US',
      timezone: data.timezone || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      isp: data.org || 'Unknown'
    }

    return locationData
  } catch (error) {
    console.error('Location tracking error:', error)
    return getFallbackLocation()
  }
}

/**
 * Fallback location when API fails
 * Uses browser timezone to guess location
 */
const getFallbackLocation = (): LocationData => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const isLikelyUSA = timezone.includes('America/') || timezone.includes('US/')

  return {
    ip: 'Unknown',
    city: 'Unknown',
    state: 'Unknown',
    country: isLikelyUSA ? 'United States' : 'Unknown',
    countryCode: isLikelyUSA ? 'US' : 'XX',
    isUSA: isLikelyUSA,
    timezone: timezone,
    latitude: 0,
    longitude: 0,
    isp: 'Unknown'
  }
}

/**
 * Get basic browser information
 */
export const getBrowserInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

/**
 * Format location data for display
 */
export const formatLocation = (location: LocationData): string => {
  const parts = [location.city, location.state, location.country].filter(p => p !== 'Unknown')
  return parts.join(', ') || 'Location unavailable'
}

/**
 * Get country flag emoji
 */
export const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    'US': '🇺🇸',
    'CA': '🇨🇦',
    'GB': '🇬🇧',
    'AU': '🇦🇺',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'JP': '🇯🇵',
    'CN': '🇨🇳',
    'IN': '🇮🇳',
    'MX': '🇲🇽',
    'BR': '🇧🇷',
    'XX': '🌍'
  }
  return flags[countryCode] || '🌍'
}

