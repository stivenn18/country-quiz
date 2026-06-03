import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import '@testing-library/jest-dom'

//  Utilidades 
import { shuffle, generateQuestions, getHighScore, saveHighScore } from '../utils/quiz'
import { Country } from '../types'

// Componentes 
import OptionButton from '../components/OptionButton'
import TimerBar from '../components/TimerBar'
import Home from '../pages/Home'

// Datos de prueba 
const mockCountries: Country[] = Array.from({ length: 30 }, (_, i) => ({
  name: { common: `País ${i}`, official: `República de País ${i}` },
  capital: [`Capital ${i}`],
  region: 'Americas',
  flags: { svg: `https://example.com/flag${i}.svg`, png: '' },
  population: (i + 1) * 100_000,
  cca2: `P${i}`,
}))


// PRUEBA 1 — Estado de CARGA
// Verifica que Quiz muestra el spinner mientras fetch nunca resuelve

describe('Prueba 1 — Estado de CARGA en Quiz', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => { /* fetch que nunca resuelve */ })),
    )
  })

  it('muestra "Cargando preguntas..." mientras fetch no resuelve', async () => {
    const { default: Quiz } = await import('../pages/Quiz')

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/quiz']}>
          <Routes>
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </MemoryRouter>,
      )
    })

    expect(screen.getByText(/cargando preguntas/i)).toBeInTheDocument()
  })
})


// PRUEBA 2 — Estado de ERROR
// Verifica que Quiz muestra error y botón Reintentar cuando la API falla

describe('Prueba 2 — Estado de ERROR en Quiz', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Error al cargar los países'))),
    )
  })

  it('muestra el error y el botón Reintentar cuando fetch falla', async () => {
    const { default: Quiz } = await import('../pages/Quiz')

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/quiz']}>
          <Routes>
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </MemoryRouter>,
      )
    })

    
    const errorMessages = screen.getAllByText(/error al cargar/i)
    expect(errorMessages.length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument()
  })
})


// PRUEBA 3 — Interactividad en OptionButton

describe('Prueba 3 — Interactividad en OptionButton', () => {
  it('llama a onClick cuando el estado es "default"', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<OptionButton label="Francia" state="default" onClick={handleClick} />)
    await user.click(screen.getByRole('button', { name: /Francia/i }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('NO llama a onClick cuando el estado es "correct" (ya respondida)', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<OptionButton label="Francia" state="correct" onClick={handleClick} />)
    await user.click(screen.getByRole('button', { name: /Francia/i }))
    expect(handleClick).not.toHaveBeenCalled()
  })
})


// PRUEBA 4 — Persistencia de High Score

describe('Prueba 4 — Persistencia de High Score en localStorage', () => {
  beforeEach(() => localStorage.clear())

  it('getHighScore retorna 0 cuando no hay datos guardados', () => {
    expect(getHighScore()).toBe(0)
  })

  it('saveHighScore guarda el puntaje si es mayor al actual', () => {
    saveHighScore(7)
    expect(getHighScore()).toBe(7)
  })

  it('saveHighScore NO sobreescribe si el nuevo puntaje es menor', () => {
    saveHighScore(8)
    saveHighScore(5)
    expect(getHighScore()).toBe(8)
  })
})


// PRUEBA BONUS — Utilidades y componentes simples

describe('Utilidades — shuffle, generateQuestions y componentes', () => {
  it('shuffle retorna el mismo número de elementos', () => {
    expect(shuffle([1, 2, 3, 4, 5])).toHaveLength(5)
  })

  it('generateQuestions retorna exactamente 10 preguntas', () => {
    expect(generateQuestions(mockCountries)).toHaveLength(10)
  })

  it('TimerBar muestra el tiempo restante', () => {
    render(<TimerBar timeLeft={12} total={15} />)
    expect(screen.getByText('12s')).toBeInTheDocument()
  })

  it('Home muestra el botón Comenzar', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /comenzar/i })).toBeInTheDocument()
  })
})
