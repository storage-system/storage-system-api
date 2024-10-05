import { faker } from "@faker-js/faker"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { FactoryProp } from "."
import { File, FileProps } from "@/domain/enterprise/file/file"

export async function makeFile({
  repository,
  override,
}: FactoryProp<
File,
  Partial<
  FileProps &
    {
      id: string
    }
  >
> = {}): Promise<File> {
  const file = File.create(
    {
      filename: faker.system.fileName(),
      path: faker.system.filePath(),
      size: faker.number.int(),
      companyId: new UniqueEntityID(override?.companyId?.toString()),
      ...override,
    }
  )

  if (repository) {
    await repository.create(file)
  }

  return file
}