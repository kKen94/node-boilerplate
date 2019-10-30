import {
  AbstractRepository,
  DeleteResult,
  InsertResult,
  UpdateResult
} from 'typeorm';

export class GenericRepository<T> extends AbstractRepository<T> {
  public async all(): Promise<T[]> {
    return await this.repository.find();
  }

  public async one<TKey>(id: TKey): Promise<T> {
    return await this.repository.findOne(id);
    // return await this.repository.findOne(id, { select: ["id", "username", "role"] });
  }

  public async add(entity: T): Promise<InsertResult> {
    return await this.repository.insert(entity);
  }

  public async update<TKey>(id: TKey, entity: T): Promise<UpdateResult> {
    return await this.repository.update(id, entity);
  }

  public async addOrUpdate(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  public async addOrUpdateRange(entities: T[]): Promise<T[]> {
    return await this.repository.save(entities);
  }

  public async delete<TKey>(entityId: TKey): Promise<DeleteResult> {
    return await this.repository.delete(entityId);
  }

  public async deleteRange(
    entitiesId: string[] | number[]
  ): Promise<DeleteResult> {
    return await this.repository.delete(entitiesId);
  }
}
