import { RecordsKey } from '../../interfaces/records.types'
import { decodeKey, encodeKey } from '../keys'

describe('shared/helpers/keys funções com chaves de entidade', () => {
  describe('decodeKey()', () => {
    it('deveria processar uma chave com "#" corretamente', () => {
      const key = 'C#a1b2c34d'

      const result = decodeKey(key)

      expect(result).toMatchObject({
        id: 'a1b2c34d',
        key: 'client',
        separator: 'hashtag'
      })
    })

    it('deveria processar uma chave com "@" corretamente', () => {
      const key = 'D@a1b2'

      const result = decodeKey(key)

      expect(result).toMatchObject({
        id: 'a1b2',
        key: 'domain',
        separator: 'at'
      })
    })

    it('deveria processar uma chave sem separadores corretamente', () => {
      const key = '102030'

      const result = decodeKey(key)

      expect(result).toMatchObject({
        id: '102030',
        separator: 'none'
      })
    })
  })

  describe('encodeKey()', () => {
    it('deveria processar uma chave com "#" corretamente', () => {
      const key = {
        id: 'a1b2c34d',
        key: 'client',
        separator: 'hashtag'
      } as any

      const result = encodeKey(key)

      expect(result).toBe('C#a1b2c34d')
    })

    it('deveria processar uma chave com "@" corretamente', () => {
      const data = {
        id: 'a1b2',
        key: 'domain',
        separator: 'at'
      } as any

      const result = encodeKey(data)

      expect(result).toBe('D@a1b2')
    })

    it('deveria processar uma chave sem separadores corretamente', () => {
      const data = {
        id: '102030',
        separator: 'none'
      } as RecordsKey

      const result = encodeKey(data)

      expect(result).toBe('102030')
    })
  })
})
