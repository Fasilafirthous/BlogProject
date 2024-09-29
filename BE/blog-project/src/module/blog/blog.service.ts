import { Injectable } from '@nestjs/common';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { BlogRepository } from './blog.repository';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepo: BlogRepository){}
 async create(userId: string,createBlogInput: CreateBlogInput) {
  console.log(userId)
    return this.blogRepo.save({...createBlogInput, userId});
  }

  async getallBlogs() { 
    return this.blogRepo.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogInput: UpdateBlogInput) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
