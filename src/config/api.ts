const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const API_TIMEOUT = 30000

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !API_BASE_URL

export { API_BASE_URL, API_TIMEOUT, USE_MOCK }
