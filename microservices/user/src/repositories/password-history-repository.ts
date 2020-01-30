import { EntityRepository } from 'typeorm';
import { PasswordHistory } from '@entity';
import { GenericRepository } from './generic-repository';

@EntityRepository(PasswordHistory)
export class PasswordHistoryRepository extends GenericRepository<PasswordHistory> {}
