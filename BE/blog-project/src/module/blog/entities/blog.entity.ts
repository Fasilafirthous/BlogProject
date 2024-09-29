import { ObjectType, Field } from '@nestjs/graphql';
import {User} from '../../user/entities/user.entity'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Blog {
  @Field(() => String, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid',{name:'id'})
  id: string;

  @Field()
  @Column({name: 'blog_title'})
  blogTitle: string;

  @Field()
  @Column({name: 'blog_content'})
  blogContent: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.blog, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Promise<User>;


  @Field({ nullable: true })
  @Column({ name: 'userId', nullable: true })
  userId?: string;
  
  @Field()
  @CreateDateColumn({
    name: 'u_created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    name: 'u_updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({
    name: 'u_deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date;


}
