import { ClientEntity } from '../../interfaces/records.types'
import { createClient } from '../records'

describe('shared/helpers/records funções com registros', () => {
  describe('createClient()', () => {
    it('deveria gerar um registro de cliente', () => {
      const id = 'id-do-cliente'
      const email = 'cliente@email.com'
      const document = '999.999.999-99'
      const password = 'G5AL98RB'

      const clientCreated = createClient(id, email, document, password)

      expect(clientCreated).toMatchObject<ClientEntity>({
        Pk: `C#${id}`,
        Sk: 'Profile',
        ListPk: 'Client',
        Email: email,
        Password: password,
        Document: document,
        DomainCount: 0
      })
    })
  })
})
