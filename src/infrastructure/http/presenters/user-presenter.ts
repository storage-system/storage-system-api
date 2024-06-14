import { User } from "@/domain/enterprise/user/user";
import { User as PrismaUser } from "@prisma/client";

export class UserPresenter {
  static toHTTP(user: User): Partial<PrismaUser> {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}