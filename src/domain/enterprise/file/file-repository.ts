import { Repository } from '@/core/repository';
import { File } from './file';

export abstract class FileRepository extends Repository<File> {}
