import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/core/validation/notification'
import { describe, it, expect, beforeEach } from 'vitest'
import { faker } from '@faker-js/faker'
import { addDays } from 'date-fns'

import {
  Product,
  ProductConstructorProps,
  ProductProps,
  StatusProduct,
} from './product'
import { StockOperation } from './stock-operation'
import { Slug } from '../slug/slug'

describe('Product Entity', () => {
  let initialProps: ProductConstructorProps

  beforeEach(() => {
    const productName = faker.commerce.product()

    initialProps = {
      name: productName,
      fileIds: [],
      slug: Slug.createFromText(productName),
      description: faker.commerce.productDescription(),
      originalPrice: 100,
      finalPrice: 0,
      discountPercentage: 10,
      quantityInStock: 50,
      minimumStock: 5,
      manufactureDate: new Date('2023-01-01'),
      validityInDays: 2,
      unitOfMeasure: 'kg',
      weight: 1.5,
      dimensions: { height: '10cm', width: '20cm', depth: '5cm' },
      manufacturer: 'Test Manufacturer',
      batch: '12345',
      status: StatusProduct.ACTIVE,
      productImage: 'test-image-url',
      companyId: new UniqueEntityID(),
      categoryIds: [new UniqueEntityID()],
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    }
  })

  it('should create a product', () => {
    const product = Product.create(initialProps)

    const manufactureDate = product.manufactureDate
    const validityInDays = product.validityInDays

    const dueDateResult = addDays(new Date(manufactureDate), validityInDays)

    const slugMocked = Slug.createFromText(initialProps.name).value

    expect(product).toBeInstanceOf(Product)
    expect(product.name).toBe(initialProps.name)
    expect(product.slug.value).toBe(slugMocked)
    expect(product.description).toBe(initialProps.description)
    expect(product.dueDate).toEqual(dueDateResult)
  })

  it('should update a product', () => {
    const product = Product.create(initialProps)

    const updatedProps: Partial<ProductProps> = {
      name: 'Updated Product',
      description: 'This is an updated test product',
      finalPrice: 70,
      quantityInStock: 40,
      manufacturer: 'Updated Manufacturer',
      status: StatusProduct.INACTIVE,
    }

    product.update(updatedProps)

    expect(product.name).toBe('Updated Product')
    expect(product.slug.value).toBe('updated-product')
    expect(product.description).toBe(updatedProps.description)
    expect(product.finalPrice).toBe(updatedProps.finalPrice)
    expect(product.quantityInStock).toBe(updatedProps.quantityInStock)
    expect(product.manufacturer).toBe('Updated Manufacturer')
    expect(product.status).toBe(StatusProduct.INACTIVE)
  })

  it('should have the correct getters', () => {
    const product = Product.create(initialProps)
    const slugMocked = Slug.createFromText(initialProps.name).value

    expect(product.name).toBe(initialProps.name)
    expect(product.slug.value).toBe(slugMocked)
    expect(product.description).toBe(initialProps.description)
    expect(product.originalPrice).toBe(initialProps.originalPrice)
    expect(product.finalPrice).toBe(initialProps.finalPrice)
    expect(product.discountPercentage).toBe(initialProps.discountPercentage)
    expect(product.quantityInStock).toBe(initialProps.quantityInStock)
    expect(product.manufactureDate).toEqual(new Date('2023-01-01'))
    expect(product.validityInDays).toBe(initialProps.validityInDays)
    expect(product.unitOfMeasure).toBe('kg')
    expect(product.weight).toBe(1.5)
    expect(product.dimensions).toEqual({
      height: '10cm',
      width: '20cm',
      depth: '5cm',
    })
    expect(product.manufacturer).toBe('Test Manufacturer')
    expect(product.batch).toBe('12345')
    expect(product.status).toBe(StatusProduct.ACTIVE)
    expect(product.productImage).toBe('test-image-url')
    expect(product.companyId).toBeInstanceOf(UniqueEntityID)
    expect(product.categoryIds.length).toBe(1)
    expect(product.categoryIds[0]).toBeInstanceOf(UniqueEntityID)
    expect(product.createdAt).toBeInstanceOf(Date)
    expect(product.updatedAt).toBeNull()
    expect(product.deletedAt).toBeNull()
  })

  it('should increase stock when operation is INCREASE', () => {
    const product = Product.create(initialProps)
    const initialStock = product.quantityInStock

    product.adjustStock(10, StockOperation.INCREASE, Notification.create())

    expect(product.quantityInStock).toBe(initialStock + 10)
  })

  it('should decrease stock when operation is DECREASE and stock is sufficient', () => {
    const product = Product.create(initialProps)
    const initialStock = product.quantityInStock

    product.adjustStock(20, StockOperation.DECREASE, Notification.create())

    expect(product.quantityInStock).toBe(initialStock - 20)
  })

  it('should throw an error when trying to decrease stock below zero', () => {
    const product = Product.create(initialProps)
    const notification = Notification.create()

    product.adjustStock(60, StockOperation.DECREASE, notification)

    expect(notification.getErrors()).toContainEqual(
      expect.objectContaining({
        message: 'Estoque insuficiente.',
      }),
    )
  })

  it('should add an error to notification when passing a negative quantity', () => {
    const product = Product.create(initialProps)
    const notification = Notification.create()

    product.adjustStock(-5, StockOperation.INCREASE, notification)

    expect(notification.getErrors()).toContainEqual(
      expect.objectContaining({
        message: 'A quantidade deve ser maior que zero.',
      }),
    )
  })
})
