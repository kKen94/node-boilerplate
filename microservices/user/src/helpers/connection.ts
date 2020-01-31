import { getCustomRepository } from 'typeorm';
import { ObjectType } from 'typeorm/common/ObjectType';

export function getRepo<T>(customRepository: ObjectType<T>): T {
  return getCustomRepository(customRepository, process.env.NODE_ENV);
}
