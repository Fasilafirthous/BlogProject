import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/baserepository';
import { DataSource, EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepositoy extends BaseRepository<User>{
    constructor(
        private dataSource: DataSource,
        private entityManager: EntityManager,
      ) {
        super(User, dataSource.createEntityManager());
      }
}
