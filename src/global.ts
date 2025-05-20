import { CollectMarksFn, MarkPageFn } from './types'

declare global {
  interface Window {
    markPage: MarkPageFn
    collectMarks: CollectMarksFn
  }
}

export {}
