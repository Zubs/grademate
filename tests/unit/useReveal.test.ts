import { afterEach, describe, expect, it, vi } from 'vitest'
import { startReveal } from '~/composables/useReveal'

function stubMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', () => ({ matches: reduced }))
}

function elementBelowFold() {
  const element = document.createElement('div')
  element.getBoundingClientRect = () => ({ top: window.innerHeight + 100 }) as DOMRect
  return element
}

describe('startReveal', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('skips setup under reduced motion', () => {
    stubMotion(true)
    const element = elementBelowFold()
    startReveal(element)
    expect(element.classList.contains('reveal-pending')).toBe(false)
  })

  it('leaves content already on screen alone', () => {
    stubMotion(false)
    const element = document.createElement('div')
    element.getBoundingClientRect = () => ({ top: 0 }) as DOMRect
    startReveal(element)
    expect(element.classList.contains('reveal-pending')).toBe(false)
  })

  it('reveals once when scrolled into view', () => {
    stubMotion(false)
    let trigger: (entries: { isIntersecting: boolean }[]) => void = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: typeof trigger) {
        trigger = callback
      }

      observe() {}
      disconnect = disconnect
    })
    const element = elementBelowFold()
    startReveal(element)
    expect(element.classList.contains('reveal-pending')).toBe(true)
    trigger([{ isIntersecting: true }])
    expect(element.classList.contains('reveal-done')).toBe(true)
    expect(disconnect).toHaveBeenCalled()
  })
})
