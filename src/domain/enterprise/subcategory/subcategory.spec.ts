import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Subcategory, SubcategoryProps } from './subcategory'
import { Slug } from '../slug/slug'

describe('Subcategory Entity', () => {
  it('should create a subcategory with provided props', () => {
    const props = {
      name: 'subcategory-01',
      slug: Slug.createFromText('Test  '),
      categoryId: new UniqueEntityID('category-01'),
      isActive: true,
    }

    const subcategory = Subcategory.create(props)

    expect(subcategory.name).toBe(props.name)
    expect(subcategory.slug).toEqual(Slug.createFromText(props.slug.value))
    expect(subcategory.categoryId).toBe(props.categoryId)
    expect(subcategory.isActive).toBe(props.isActive)
  })

  it('should update name, slug, and updatedAt when name is set', () => {
    const props = {
      name: 'Test Subcategory',
      slug: Slug.createFromText('Test Subcategory'),
      categoryId: new UniqueEntityID('category-01'),
      isActive: true,
      createdAt: new Date(),
    }

    const subcategory = Subcategory.create(props)

    subcategory.name = 'Updated Subcategory'

    expect(subcategory.name).toBe('Updated Subcategory')
    expect(subcategory.slug).toEqual(Slug.createFromText('Updated Subcategory'))
    expect(subcategory.updatedAt).toBeInstanceOf(Date)
  })
})
