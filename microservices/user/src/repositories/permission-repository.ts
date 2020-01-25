import { EntityRepository } from 'typeorm';
import { Permission } from '../entities/permission';
import { GenericRepository } from './generic-repository';

@EntityRepository(Permission)
export class PermissionRepository extends GenericRepository<Permission> {}
