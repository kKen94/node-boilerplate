import { EntityRepository } from 'typeorm';
import { Permission } from '../models/permission';
import { GenericRepository } from './generic-repository';

@EntityRepository(Permission)
export class PermissionRepository extends GenericRepository<Permission> {}
