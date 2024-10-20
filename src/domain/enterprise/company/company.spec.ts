import { Company, CompanyProps } from './company'

describe('Company Entity', () => {
  it('should create a company with provided props', () => {
    const props: CompanyProps = {
      tradeName: 'Company 01',
      corporateName: 'Corporate 01',
      cnpj: '12345678000100',
      email: 'test@example.com',
      contact: '123456789',
      responsibleId: '0fde67c5-56ab-4fb0-8ce3-3226d10063f7',
      address: {
        street: 'Main Street',
        city: 'City A',
        state: 'State A',
        country: 'Country A',
      },
      createdAt: new Date(),
    }

    const company = Company.create(props)

    expect(company.tradeName).toBe(props.tradeName)
    expect(company.corporateName).toBe(props.corporateName)
    expect(company.cnpj).toBe(props.cnpj)
    expect(company.email).toBe(props.email)
    expect(company.contact).toBe(props.contact)
    expect(company.address).toEqual(props.address)
    expect(company.responsibleId).toBe(props.responsibleId)
  })

  it('should update company tradeName and corporateName', () => {
    const company = Company.create({
      tradeName: 'Old Trade Name',
      corporateName: 'Old Corporate Name',
      cnpj: '12345678000100',
      email: 'test@example.com',
      contact: '123456789',
      responsibleId: '0fde67c5-56ab-4fb0-8ce3-3226d10063f7',
      address: {
        street: 'Main Street',
        city: 'City A',
        state: 'State A',
        country: 'Country A',
      },
      createdAt: new Date(),
    })

    company.update({
      tradeName: 'New Trade Name',
      corporateName: 'New Corporate Name',
    })

    expect(company.tradeName).toBe('New Trade Name')
    expect(company.corporateName).toBe('New Corporate Name')
  })

  it('should update only the provided fields and keep others unchanged', () => {
    const company = Company.create({
      tradeName: 'Company 01',
      corporateName: 'Corporate 01',
      cnpj: '12345678000100',
      email: 'old@example.com',
      contact: '123456789',
      responsibleId: '0fde67c5-56ab-4fb0-8ce3-3226d10063f7',
      address: {
        street: 'Main Street',
        city: 'City A',
        state: 'State A',
        country: 'Country A',
      },
      createdAt: new Date(),
    })

    company.update({ email: 'new@example.com' })

    expect(company.email).toBe('new@example.com')
    expect(company.tradeName).toBe('Company 01')
    expect(company.address.city).toBe('City A')
  })

  it('should keep the old address if no new address is provided', () => {
    const company = Company.create({
      tradeName: 'Company 01',
      corporateName: 'Corporate 01',
      cnpj: '12345678000100',
      email: 'test@example.com',
      contact: '123456789',
      responsibleId: '0fde67c5-56ab-4fb0-8ce3-3226d10063f7',
      address: {
        street: 'Main Street',
        city: 'City A',
        state: 'State A',
        country: 'Country A',
      },
      createdAt: new Date(),
    })

    company.update({ tradeName: 'Updated Company' })

    expect(company.address).toEqual({
      street: 'Main Street',
      city: 'City A',
      state: 'State A',
      country: 'Country A',
    })
  })
})
