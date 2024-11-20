import { ref, type Ref } from 'vue'

interface ApiResponse<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
}

const BASE_URL = 'https://dummyjson.com'

export async function useApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`

  try {
    let fetchFunction: typeof fetch

    if (typeof window !== 'undefined') {
      fetchFunction = window.fetch
    }
    else {
      fetchFunction = fetch
    }

    const response = await fetchFunction(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json: T = await response.json()
    data.value = json
  }
  catch (e) {
    error.value = e instanceof Error ? e : new Error('Unknown error occurred')
  }

  return {
    data,
    error
  }
}
