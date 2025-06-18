function localStorageHandler() {
  const get = <T>(key: string, defaultValue: T): T => {
    const value = localStorage.getItem(key)
    if (value === null) {
      return defaultValue
    }
    if (typeof defaultValue === 'string') {
      return value as T
    }
    if (typeof defaultValue === 'number') {
      return Number(value) as T
    }
    if (typeof defaultValue === 'boolean') {
      return (value === 'true') as T
    }
    try {
      return JSON.parse(value) as T
    }
    catch (error) {
      console.error(`Failed to parse localStorage item "${key}":`, error)
      return defaultValue
    }
  }

  const set = <T>(key: string, value: T): void => {
    if (typeof value === 'string') {
      localStorage.setItem(key, value)
      return
    }
    if (typeof value === 'number') {
      localStorage.setItem(key, value.toString())
      return
    }
    if (typeof value === 'boolean') {
      localStorage.setItem(key, value ? 'true' : 'false')
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  }

  return { get, set }
}

export default localStorageHandler()