import type { App } from 'vue'
import { getCurrentInstance } from 'vue'

export function useApp(): App {
  const app = getCurrentInstance()?.appContext.app

  if (!app) {
    throw new Error('Vue app instance not found')
  }

  return app
}
