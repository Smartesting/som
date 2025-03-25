import { MarkPageFn } from './types'

declare global {
  interface Window {
    markPage: MarkPageFn
  }
}

export {}
