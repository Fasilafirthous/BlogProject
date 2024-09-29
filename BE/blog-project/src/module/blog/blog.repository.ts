import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/baserepository';
import { DataSource, EntityManager } from 'typeorm';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogRepository extends BaseRepository<Blog>{
    constructor(
        private dataSource: DataSource,
        private entityManager: EntityManager,
      ) {
        super(Blog, dataSource.createEntityManager());
      }
}
