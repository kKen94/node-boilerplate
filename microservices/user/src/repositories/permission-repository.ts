import { Permission } from '@entity';
import { EntityRepository } from 'typeorm';
import { GenericRepository } from './generic-repository';

@EntityRepository(Permission)
export class PermissionRepository extends GenericRepository<Permission> {}
