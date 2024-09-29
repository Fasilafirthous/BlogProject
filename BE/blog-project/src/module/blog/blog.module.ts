import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { BlogRepository } from './blog.repository';

@Module({
  providers: [BlogResolver, BlogService,BlogRepository]
})
export class BlogModule {}
