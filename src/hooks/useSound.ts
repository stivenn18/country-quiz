import { useRef, useCallback } from 'react'

/** Genera un tono simple con la Web Audio API y lo retorna como URL de objeto */
function createBeepUrl(
  freq: number,
  duration: number,
  type: OscillatorType,
): string | null {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return null

    const ctx = new AudioCtx()
    const sampleRate = ctx.sampleRate
    const samples = Math.floor(sampleRate * duration)
    const buffer = ctx.createBuffer(1, samples, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate
      const envelope = Math.exp((-4 * i) / samples)
      data[i] =
        type === 'sine'
          ? Math.sin(2 * Math.PI * freq * t) * envelope
          : (((t * freq) % 1) - 0.5) * envelope
    }

    // Convertir a WAV y crear URL de objeto
    const arrayBuffer = new ArrayBuffer(44 + samples * 2)
    const view = new DataView(arrayBuffer)
    const writeStr = (o: number, s: string) => {
      for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i))
    }
    writeStr(0, 'RIFF')
    view.setUint32(4, 36 + samples * 2, true)
    writeStr(8, 'WAVE')
    writeStr(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeStr(36, 'data')
    view.setUint32(40, samples * 2, true)
    for (let i = 0; i < samples; i++) {
      const s = Math.max(-1, Math.min(1, data[i]))
      view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }

    ctx.close()
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' })
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

export function useSound() {
  const successUrl = useRef<string | null>(null)
  const errorUrl = useRef<string | null>(null)

  // Inicialización lazy: se crea la primera vez que se reproduce
  const ensureUrls = useCallback(() => {
    if (!successUrl.current) successUrl.current = createBeepUrl(880, 0.15, 'sine')
    if (!errorUrl.current) errorUrl.current = createBeepUrl(220, 0.2, 'sawtooth')
  }, [])

  const playSuccess = useCallback(() => {
    ensureUrls()
    if (!successUrl.current) return
    try {
      const audio = new Audio(successUrl.current)
      audio.play().catch(() => null)
    } catch {
      // Silenciar errores en entornos sin soporte de audio
    }
  }, [ensureUrls])

  const playError = useCallback(() => {
    ensureUrls()
    if (!errorUrl.current) return
    try {
      const audio = new Audio(errorUrl.current)
      audio.play().catch(() => null)
    } catch {
      // Silenciar errores en entornos sin soporte de audio
    }
  }, [ensureUrls])

  return { playSuccess, playError }
}
