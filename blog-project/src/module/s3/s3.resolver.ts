import { UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { TimeoutInterceptor } from '../../auth/decorators/timeout.interceptor';
// import { CompleteMultiPartUploadInput } from '../common/common.types';

@Resolver('S3')
@UseInterceptors(TimeoutInterceptor)
export class S3Resolver {
  constructor(private readonly s3Service: S3Service) {}

  /**
   * get signed URL for upload the media files to S3
   * @param bucketName
   * @param key
   * @returns signed URL upload
   */
  @Query(() => String, {
    description:
      'This API is used to get the presigned URL for upload the file to S3 Bucket. We will not be having permission to upload the file directly to S3.',
  })
  async getSignedUrlForUpload(
    @Args('bucketName') bucketName: string,
    @Args('key', {
      description:
        'The location where the file should be uploaded in S3 Bucket',
    })
    key: string,
  ) {
    return this.s3Service.getSignedUrlForUpload(bucketName, key);
  }

  /**
   * get signed URL for download the media files to S3
   * @param bucketName
   * @param key
   * @returns signed URL for download
   */
  @Query(() => String, {
    description:
      'This API is used to get the presigned URL for download the file from S3 Bucket. We will not be having permission to download the file directly from S3.',
  })
  async getSignedUrlForDownload(
    @Args('bucketName') bucketName: string,
    @Args('key', {
      description:
        'The location where the file should be downloaded from S3 Bucket',
    })
    key: string,
  ) {
    return this.s3Service.getSignedUrlForDownload(bucketName, key);
  }

  /**
   *
   * @param bucketName
   * @param key
   * @returns
   */
  @Query(() => String, {
    description:
      'This API is used to get the presigned url for delete file from S3.',
  })
  async getSignedUrlForDelete(
    @Args('bucketName') bucketName: string,
    @Args('key', {
      description: 'The location where the file stored in S3 Bucket',
    })
    key: string,
  ) {
    return this.s3Service.getSignedUrlForDelete(bucketName, key);
  }

  @Query(() => String, {
    description: 'This API is used to delete the file in S3 bucket.',
  })
  async s3FileDelete(
    @Args('bucketName') bucketName: string,
    @Args('key', {
      description: 'The location where the file stored in S3 Bucket',
    })
    key: string,
  ) {
    return this.s3Service.deleteS3File(bucketName, key);
  }

  @Query(() => String, {
    description: 'This API is used to delete the multiple files in S3 bucket.',
  })
  async s3MultipleFileDelete(
    @Args('bucketName') bucketName: string,
    @Args('key', {
      type: () => [String],
      description: 's3 object Key',
    })
    key: string[],
  ) {
    return this.s3Service.s3MultipleFileDelete(bucketName, key);
  }

  @Query(() => String, {
    description: 'This API is used to get the upload id',
  })
  async getMultipartUpload(
    @Args('bucketName') bucketName: string,
    @Args('key', {
      description:
        'The location where the file should be uploaded in S3 Bucket',
    })
    key: string,
  ) {
    return this.s3Service.getMultipartUpload(bucketName, key);
  }
  @Query(() => String, {
    description:
      'This API is used to get the presigned URL for upload the file from S3 Bucket with parts and upload id',
  })
  async getSignedUrlForMultipartUpload(
    @Args('bucketName') bucketName: string,
    @Args('key', {
      description:
        'The location where the file should be uploaded in S3 Bucket',
    })
    key: string,
    @Args('uploadId', {
      description: 'The upload id',
    })
    uploadId?: string,
    @Args('partNumber', {
      description: 'The part number',
      type: () => Int,
    })
    partNumber?: number,
  ) {
    return this.s3Service.getSignedUrlForUpload(
      bucketName,
      key,
      uploadId,
      partNumber,
    );
  }

  // @Query(() => String, {
  //   description: 'This API is used to complete the multipart upload',
  // })
  // async getCompleteMultiPartUpload(
  //   @S3Bucket() bucketName: string,
  //   @Args('completeMultiPartUploadInput')
  //   completeMultiPartUploadInput: CompleteMultiPartUploadInput,
  // ) {
  //   return this.s3Service.getCompleteMultipartUpload(
  //     bucketName,
  //     completeMultiPartUploadInput.key,
  //     completeMultiPartUploadInput.uploadId,
  //     completeMultiPartUploadInput.parts,
  //   );
  // }
}
