import { File, FileProps } from '@/domain/enterprise/file/file'
import { faker } from '@faker-js/faker'

import { FactoryProp } from '.'

export async function makeFile({
  repository,
  override,
}: FactoryProp<
  File,
  Partial<
    FileProps & {
      id: string
    }
  >
> = {}): Promise<File> {
  const file = File.create({
    filename: faker.system.fileName(),
    path: faker.system.filePath(),
    size: faker.number.int(),
    ...override,
  })

  if (repository) {
    await repository.save(file)
  }

  return file
}
