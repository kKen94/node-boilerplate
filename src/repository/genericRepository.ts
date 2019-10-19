import { AbstractRepository } from "typeorm";

export class GenericRepository<T> extends AbstractRepository<T> {

    public async all(): Promise<T[]> {
        return await this.repository.find();
    }
}