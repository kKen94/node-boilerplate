import { PasswordHistory } from '@entity';
import { EntityRepository } from 'typeorm';
import { GenericRepository } from './generic-repository';

@EntityRepository(PasswordHistory)
export class PasswordHistoryRepository extends GenericRepository<PasswordHistory> {}
