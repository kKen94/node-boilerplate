import { Company } from '@entity';
import { EntityRepository } from 'typeorm';
import { GenericRepository } from './generic-repository';

@EntityRepository(Company)
export class CompanyRepository extends GenericRepository<Company> {}
