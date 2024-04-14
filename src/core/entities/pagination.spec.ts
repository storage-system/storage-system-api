import { Pagination } from './pagination'

describe('Pagination Unit Test', () => {
  it('should map a Pagination', () => {
    const expected = {
      total: 1,
      items: [1],
      perPage: 5,
      page: 1,
    }

    const pagination = new Pagination<number>({
      total: expected.total,
      items: expected.items,
      perPage: expected.perPage,
      page: expected.page,
    })

    expect(pagination.map((item) => item)).toEqual(expected)
  })
})
