import { Pagination } from './pagination'

describe('Pagination Unit Test', () => {
  it('should map a Pagination', () => {
    const expected = {
      total: 1,
      items: [1],
      perPage: 5,
      currentPage: 1,
    }

    const pagination = new Pagination<number>(
      expected.total,
      expected.items,
      expected.perPage,
      expected.currentPage,
    )

    expect(pagination.map((item) => item)).toEqual(expected)
  })
})
