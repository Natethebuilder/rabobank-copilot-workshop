export const CHANNEL = 'rcw-deck'
export const isPreview = () => new URLSearchParams(window.location.search).has('preview')

export function openChannel(onMessage) {
  if (typeof BroadcastChannel === 'undefined') return { post: () => {}, close: () => {} }
  const bc = new BroadcastChannel(CHANNEL)
  if (onMessage) bc.onmessage = (e) => onMessage(e.data || {})
  return { post: (m) => bc.postMessage(m), close: () => bc.close() }
}

export const pressKey = (key) => document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
export const isTypingTarget = (t) => t instanceof Element && Boolean(t.closest('input, textarea, select, [contenteditable="true"]'))
export const openPresenter = () => window.open('#/presenter', 'rcw-presenter', 'width=1280,height=800')
