import '@testing-library/jest-dom'
import { vi } from 'vitest'

// ── Mock AudioContext (jsdom no lo implementa) ────────────────────────────────
class MockAudioContext {
  createBuffer() {
    return { getChannelData: () => new Float32Array(0) }
  }
  createBufferSource() {
    return { connect: vi.fn(), start: vi.fn() }
  }
  get sampleRate() { return 44100 }
  close() { return Promise.resolve() }
}

vi.stubGlobal('AudioContext', MockAudioContext)
vi.stubGlobal('Audio', class {
  src = ''
  currentTime = 0
  play() { return Promise.resolve() }
})

// ── Mock window.matchMedia (jsdom no lo implementa) ──────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
