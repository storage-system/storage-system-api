import { User, UserProps } from '@/domain/enterprise/user/user';
import { UserRoles } from '@/domain/enterprise/user/user-types';
import { Company, CompanyProps } from '@/domain/enterprise/company/company';

export class CompanyPresenter {
  id: string
  name: string
  email: string
  contact: string
  responsible: string
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
  users: {
    id: string
    name: string
    email: string
    phone: string
    role: UserRoles
    createdAt: Date
    updatedAt?: Date
  }[]

  constructor(
    aCompanyProps: CompanyProps & { id: string },
    anUserProps: Required<
      {
        id: string;
      } & UserProps
    >[],
  ) {
    this.id = aCompanyProps.id.toString();
    this.name = aCompanyProps.name;
    this.email = aCompanyProps.email;
    this.contact = aCompanyProps.contact;
    this.responsible = aCompanyProps.responsible;
    this.createdAt = aCompanyProps.createdAt;
    this.updatedAt = aCompanyProps.updatedAt;
    this.deletedAt = aCompanyProps.deletedAt,
      this.users = anUserProps.length > 0
        ? anUserProps.map((user) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })) : [];
  }

  static fromAggregate(
    aCompany: Company,
    user: User[],
  ) {
    const userProps = user.length > 0
      ? user.map((user) => user.toJSON())
      : [];

    return new CompanyPresenter(
      aCompany.toJSON(),
      userProps,
    );
  }
}
