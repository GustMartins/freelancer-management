import { monthDifference, nextMonth, previousNMonths } from '../dates'

describe('hared/helpers/dates funções com padrões de acesso', () => {
  describe('nextMonth()', () => {
    it('deveria retornar o próximo mês corretamente', () => {
      const now = new Date()
      const result = nextMonth()

      expect(parseInt(result.toISOString().substring(0, 4))).toBe(now.getFullYear())
      expect(parseInt(result.toISOString().substring(5, 7))).toBe(now.getMonth() + 2)
    })
  })

  describe('monthDifference()', () => {
    it('deveria retornar a diferença de meses corretamente', () => {
      const start = new Date('2022-04')
      const end = new Date('2022-09')

      const result = monthDifference(start, end)

      expect(result).toBe(5)
    })

    it('deveria retornar a diferença de meses corretamente mesmo entre anos', () => {
      const start = new Date('2021-04')
      const end = new Date('2022-09')

      const result = monthDifference(start, end)

      expect(result).toBe(17)
    })
  })

  describe('previousNMonths()', () => {
    it('deveria retornar a quantidade certa de registros', () => {
      const total = 2

      const result = previousNMonths(total)

      expect(result.length).toBe(total)
    })
  })
})
