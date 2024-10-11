import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserRole } from 'src/common/common.enum';
import { Blog } from 'src/module/blog/entities/blog.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => String, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid',{name: 'u_id'})
  id: string;

  @Field()
  @Column({name: 'user_name'})
  userName: string;

  @Field()
  @Column({name: 'email'})
  email: string;


  @Field()
  @Column({name: 'profile_url', nullable:true})
  profileUrl: string;


  @Field()
  @Column({name: 'Cognito_id'})
  cognitoId: string;


  @Field(()=> UserRole)
  @Column({name: 'role' , type: 'enum', enum: UserRole})
  role: UserRole;

    @Field(() => [Blog], { nullable: true })
  @OneToMany(() => Blog, (blog) => blog.user, {
    cascade: true,
  })
  blog?: Blog[];
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


