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
  public async find(options?: FindManyOptions<T> | FindConditions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  public async findAndCount(options?: FindManyOptions<T> | FindConditions<T>): Promise<[T[], number]> {
    return await this.repository.findAndCount(options);
  }

  public async findOne(options: FindOneOptions<T>, conditions?: FindConditions<T>): Promise<T> {
    return conditions
      ? await this.repository.findOneOrFail(conditions, options)
      : await this.repository.findOneOrFail(options);
  }

  public async findById<TKey>(id: TKey, options?: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOneOrFail(id, options);
  }

  /**
   * Inserts a given entity into the database.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient INSERT query.
   * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
   */
  /** @deprecated */
  public async insert(entity: T): Promise<InsertResult> {
    return await this.repository.insert(entity);
  }

  /**
   * Updates entity partially. Entity can be found by a given conditions.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient UPDATE query.
   * Does not check if entity exist in the database.
   */
  /** @deprecated */
  public async update<TKey>(id: TKey, entity: T): Promise<UpdateResult> {
    return await this.repository.update(id, entity);
  }

  public async addOrUpdate(entity: T, options?: SaveOptions): Promise<T> {
    return await this.repository.save(entity, options);
  }

  public async addOrUpdateRange(entities: T[], options?: SaveOptions): Promise<T[]> {
    return await this.repository.save(entities, options);
  }

  public async delete<TKey>(entityId: TKey): Promise<DeleteResult> {
    return await this.repository.delete(entityId);
  }

  public async deleteRange(entitiesId: string[] | number[]): Promise<DeleteResult> {
    return await this.repository.delete(entitiesId);
  }

  public async any(options?: FindOneOptions<T>): Promise<boolean> {
    return options ? !!(await this.repository.findOne(options)) : !!(await this.repository.findOne());
  }
}
