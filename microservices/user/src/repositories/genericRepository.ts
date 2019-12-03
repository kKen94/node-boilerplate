import {
  AbstractRepository,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  InsertResult,
  UpdateResult,
} from 'typeorm';
import { SaveOptions } from 'typeorm/repository/SaveOptions';

export class GenericRepository<T> extends AbstractRepository<T> {
  public async all(
    count = false,
    options?: FindManyOptions<T> | FindConditions<T>,
  ): Promise<T[] | [T[], number]> {
    return count
      ? await this.repository.findAndCount(options)
      : await this.repository.find(options);
  }

  public async one(
    options: FindOneOptions<T>,
    conditions?: FindConditions<T>,
  ): Promise<T> {
    return conditions
      ? await this.repository.findOneOrFail(conditions, options)
      : await this.repository.findOneOrFail(options);
  }

  public async getById<TKey>(
    id: TKey,
    options?: FindOneOptions<T>,
  ): Promise<T> {
    return await this.repository.findOneOrFail(id, options);
  }

  /**
   * Inserts a given entity into the database.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient INSERT query.
   * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
   */
  public async insert(entity: T): Promise<InsertResult> {
    return await this.repository.insert(entity);
  }

  /**
   * Updates entity partially. Entity can be found by a given conditions.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient UPDATE query.
   * Does not check if entity exist in the database.
   */
  public async update<TKey>(id: TKey, entity: T): Promise<UpdateResult> {
    return await this.repository.update(id, entity);
  }

  public async addOrUpdate(entity: T, options?: SaveOptions): Promise<T> {
    return await this.repository.save(entity, options);
  }

  public async addOrUpdateRange(
    entities: T[],
    options: SaveOptions,
  ): Promise<T[]> {
    return await this.repository.save(entities);
  }

  public async delete<TKey>(entityId: TKey): Promise<DeleteResult> {
    return await this.repository.delete(entityId);
  }

  public async deleteRange(
    entitiesId: string[] | number[],
  ): Promise<DeleteResult> {
    return await this.repository.delete(entitiesId);
  }
}
