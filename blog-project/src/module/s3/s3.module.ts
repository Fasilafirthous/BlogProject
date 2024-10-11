import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Resolver } from './s3.resolver';

@Module({
  providers: [S3Resolver, S3Service]
})
export class S3Module {}
