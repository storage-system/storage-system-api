import { File } from '@/domain/enterprise/file/file'
import { FileRepository } from '@/domain/enterprise/file/file-repository'

export class InMemoryFileRepository implements FileRepository {
  public items: File[] = []

  async create(file: File) {
    this.items.push(file)
  }

  async findById(anId: string): Promise<File | null> {
    const file = this.items.find((file) => file.id.toString() === anId)

    if (!file) {
      return null
    }

    return file
  }

  update(record: File): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(anId: string): Promise<void> {
    const filteredFiles = this.items.filter((file) => file.id.toString() !== anId)
    this.items = filteredFiles
  }
}
