import { UserPayload } from '@/infrastructure/decorators/current-user.decorator'
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import ResourceNotFoundException from '@/core/exception/not-found-exception'
import { UsersRepository } from '@/domain/enterprise/user/users-repository'
import { User } from '@/domain/enterprise/user/user'
import Error from '@/core/validation/error'

@Injectable()
export class CurrentUserPipe implements PipeTransform {
  constructor(private readonly userRepository: UsersRepository) {}
  async transform(
    value: UserPayload,
    metadata: ArgumentMetadata,
  ): Promise<User> {
    const user = await this.userRepository.findById(value.sub)

    if (!user) {
      throw ResourceNotFoundException.withAnError(new Error('User not found'))
    }

    return user
  }
}
