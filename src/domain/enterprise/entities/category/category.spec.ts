import { Category } from './category'
import { Slug } from '../value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

describe('Category Entity', () => {
  it('should create a category with provided props', () => {
    const props = {
      name: 'category-01',
      slug: Slug.createFromText('Test Category'),
      companyId: new UniqueEntityID('company-01'),
      isActive: true,
    }

    const category = Category.create(props)

    expect(category.name).toBe(props.name)
    expect(category.slug).toEqual(Slug.createFromText(props.slug.value))
    expect(category.companyId).toBe(props.companyId)
    expect(category.isActive).toBe(props.isActive)
  })

  it('should update isActive and updatedAt when isActive is set', () => {
    const props = {
      name: 'Test Category',
      slug: Slug.createFromText('Test Category'),
      companyId: new UniqueEntityID('company-01'),
      isActive: true,
      createdAt: new Date(),
    }

    const category = Category.create(props)

    category.isActive = false

    expect(category.isActive).toBe(false)
    expect(category.updatedAt).toBeInstanceOf(Date)
  })

  it('should update name, slug, and updatedAt when name is set', () => {
    const props = {
      name: 'Test Category',
      slug: Slug.createFromText('Test Category'),
      companyId: new UniqueEntityID('company-01'),
      isActive: true,
      createdAt: new Date(),
    }

    const category = Category.create(props)

    category.name = 'Updated Category'

    expect(category.name).toBe('Updated Category')
    expect(category.slug).toEqual(Slug.createFromText('Updated Category'))
    expect(category.updatedAt).toBeInstanceOf(Date)
  })
})
