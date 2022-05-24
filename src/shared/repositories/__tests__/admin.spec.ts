import * as architect from '@architect/functions'

import { getAdmin } from '../admin'

jest.mock('@architect/functions', () => {
  const tablesFn = jest.fn()
  const getAdminFn = jest.fn()

  tablesFn.mockImplementation(() => Promise.resolve({
    designers: {
      get: getAdminFn
    }
  }))

  getAdminFn.mockImplementationOnce(() => Promise.resolve(null))
  getAdminFn.mockImplementationOnce(() => Promise.resolve({
    Pk: 'A#email@email.com',
    Sk: 'Admin',
    Password: 'string'
  }))

  return {
    tables: tablesFn
  }
})


describe('@repositories/admin', () => {
  describe('função getAdmin()', () => {
    it('deveria retornar um erro se não encontrar os dados do administrador', async () => {
      const payload = { Pk: 'email@email.com', Sk: 'senha' }

      const result = async () => await getAdmin(payload)

      await expect(result).rejects.toThrowError()
    })

    it('deveria retornar os dados do administrador corretamente', async () => {
      const payload = { Pk: 'email@email.com', Sk: 'senha' }

      const result = await getAdmin(payload)

      expect(result).toMatchObject({
        Pk: 'A#email@email.com',
        Sk: 'Admin',
        Password: 'string'
      })
    })
  })
})
