import { SearchQuery } from "@/core/entities/search-query";
import { UserRoles } from "@/domain/enterprise/user/user-types";

export interface ListUsersCommandProps {
  page: number;
  perPage: number;
  companyId: string;
  role: UserRoles;
}

export class ListUsersCommand extends SearchQuery {
  companyId?: string;
  role?: UserRoles;

  protected constructor({
    page = 1,
    perPage = 10,
    companyId,
    role,
  }: Partial<ListUsersCommandProps>) {
    super(page, perPage);
    this.companyId = companyId;
    this.role = role;
  }

  static create({
    page,
    perPage,
    companyId,
    role,
  }: Partial<ListUsersCommandProps>) {
    return new ListUsersCommand({
      page,
      perPage,
      companyId,
      role,
    });
  }
}
