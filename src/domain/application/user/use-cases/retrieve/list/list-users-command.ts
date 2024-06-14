import { SearchQuery } from "@/core/entities/search-query";

export interface ListUsersCommandProps {
  page: number;
  perPage: number;
  companyId: string
}

export class ListUsersCommand extends SearchQuery {
  companyId?: string

  protected constructor({
    page = 1,
    perPage = 10,
    companyId,
  }: Partial<ListUsersCommandProps>) {
    super(page, perPage);
    this.companyId = companyId
  }

  static create({
    page,
    perPage,
    companyId,
  }: Partial<ListUsersCommandProps>) {
    return new ListUsersCommand({
      page,
      perPage,
      companyId,
    });
  }
}
