import { TokenVerification } from '@entity';
import { EntityRepository } from 'typeorm';
import { GenericRepository } from './generic-repository';

@EntityRepository(TokenVerification)
export class TokenVerificationRepository extends GenericRepository<
  TokenVerification
> {}
