import { AbstractRepository, Connection, DeleteResult, InsertResult, Repository, UpdateResult } from "typeorm";
import { Container, Service } from "typedi";
import { InjectConnection } from "typeorm-typedi-extensions";
import { Factory } from "../utilities/factory";

@Service()
export class GenericRepository<T> extends AbstractRepository<T> {

    @InjectConnection()
    private connection: Connection;
    public readonly repo: Repository<T>;

    constructor() {
        super();
        this.repo = this.connection.getRepository(T);
    }

    public async all(): Promise<T[]> {
        return await this.repo.find();
    }

    public async one<TKey>(id: TKey): Promise<T> {
        return await this.repo.findOne(id);
        // return await this.repository.findOne(id, { select: ["id", "username", "role"] });
    }

    public async add(entity: T): Promise<InsertResult> {
        return await this.repo.insert(entity);
    }

    public async update<TKey>(id: TKey, entity: T): Promise<UpdateResult> {
        return await this.repo.update(id, entity);
    }

    public async addOrUpdate(entity: T): Promise<T> {
        return await this.repo.save(entity);
    }

    public async addOrUpdateRange(entities: T[]): Promise<T[]> {
        return await this.repo.save(entities);
    }

    public async delete<TKey>(entityId: TKey): Promise<DeleteResult> {
        return await this.repo.delete(entityId);
    }

    public async deleteRange(entitiesId: string[] | number[]): Promise<DeleteResult> {
        return await this.repo.delete(entitiesId);
    }
}