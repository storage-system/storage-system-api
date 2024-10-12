import { Company } from './company'

describe('Company Entity', () => {
  it('should create a company with provided props', () => {
    const props = {
      name: 'Company 01',
      email: 'test@example.com',
      password: '123456',
      contact: '123456789',
      responsible: 'John Doe',
      users: [],
    }
    const company = Company.create(props)

    expect(company.name).toBe(props.name)
    expect(company.email).toBe(props.email)
    expect(company.contact).toBe(props.contact)
    expect(company.responsible).toBe(props.responsible)
  })
})
