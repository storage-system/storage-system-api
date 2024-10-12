import { ProductsRepository } from '@/domain/enterprise/product/products-repository'
import { PaginationProps, Pagination } from '@/core/entities/pagination'
import { Product } from '@/domain/enterprise/product/product'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((product) => product.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findAll({
    page,
    perPage,
  }: PaginationProps<Product>): Promise<Pagination<Product>> {
    const items = this.items.slice((page - 1) * perPage, page * perPage)

    return new Pagination({
      total: this.items.length,
      items,
      perPage,
      page,
    })
  }

  async create(product: Product): Promise<void> {
    this.items.push(product)
  }

  async update(product: Product): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === product.id)
    this.items[itemIndex] = product
  }

  async delete(productId: string): Promise<void> {
    const filteredProducts = this.items.filter(
      (product) => product.id.toString() !== productId,
    )
    this.items = filteredProducts
  }
}
