import { Injectable, NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import axios from 'axios';
// import { s3EnvBuckets } from '../../utils/s3bucketEnv';
// const config = configData[process.env.NODE_ENV || 'development'];

@Injectable()
export class S3Service {
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      signatureVersion: 'v4',
      region: 'ap-south-1',
      accessKeyId: 'AKIAQ3EGTPD6HO7RGJTY',
      secretAccessKey: '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',
    });
  }
  /**
   * It will generate the signed url based on the request
   * @param reqType
   * @param bucketName
   * @param key
   * @returns
   */

  public async getHeadObject(bucket, key) {
    const exists = await this.s3.headObject({
      Bucket: bucket,
      Key: key,
    })
    .promise()
    .then(
      () => true,
      err => {
        if (err.code === 'NotFound') {
          return false;
        }
        throw err;
      }
    );
    console.log("exists", exists)
    return exists
  }

  async listFiles(bucketName: string, prefix: string): Promise<S3.ObjectList> {
    console.log("prefix=======>>>>>", prefix)
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
    };

    try {
      const data = await this.s3.listObjectsV2(params).promise();
      const contents = data.Contents || [];

      console.log("contents=====>>>>>", contents)
      
      // Filter the results to include only .mov files
      const movFiles = contents.filter(item => item.Key.endsWith('.mov') ||  item.Key.endsWith('.mp4'))
  
      return movFiles;
    } catch (error) {
      console.error('Error fetching objects from S3:', error);
      throw error;
    }
  }

  public async getSignedUrl(
    reqType,
    bucketName,
    key,
    uploadId = null,
    partNumber = null,
    signedUrlExpireSeconds = 60 * 60,
  ) {
    try {
      if (uploadId && partNumber) {
        const url = await this.s3.getSignedUrlPromise(`uploadPart`, {
          Bucket: bucketName,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });
        return url;
      }
     console.log(84,bucketName,key)
     const data =await this.s3.getSignedUrlPromise(`${reqType}Object`, {
        Bucket: bucketName,
        Key: key,
        Expires: signedUrlExpireSeconds,
      });
      console.log(data,"data")
      return data
    } catch (err) {
      console.error('Error fetching signed URL:', err); 
      throw new NotFoundException('File not Found ERROR : ' + err.status);
    }
  }

  //delete s3 file
  public async deleteS3File(bucket: string, key: string) {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    try {
      await this.s3.headObject(params).promise();
      await this.s3.deleteObject(params).promise();
      return 'Success';
    } catch (err) {
      throw new NotFoundException('File not Found ERROR : ' + err.status);
    }
  }

  public async s3MultipleFileDelete(bucketName: string, keys: string[]) {
    try{
      if (keys?.length > 0) {
        keys?.forEach(async (key) => {
          if (key.length != 0) {
            const params = {
              Bucket: bucketName,
              Key: key
            };
            await this.s3.deleteObject(params).promise();
          }
        });
      }
      return 'Success';
    } catch (err){
      throw new Error('Delete failed');
    }
  }

  /**
   * get signed URL for upload the media files to S3
   * @param bucketName
   * @param key
   * @returns signed URL for upload
   */
  public async getSignedUrlForUpload(
    bucketName,
    key,
    uploadId = null,
    partNumber = null,
  ) {
    console.log(bucketName,"*****",key)
    return this.getSignedUrl('put', bucketName, key, uploadId, partNumber);
  }

  public async getObjectAndUpload(bucketName, key, toUrl) {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    this.s3.getObject(params, async (err, data) => {
      if (err) {
        console.error('Error getting object:', err);
      } else {
        const response = await axios.post(
          `${toUrl}/api/s3/put-object`,
          {
            key: key,
            body: data.Body,
          },
          {
            headers: {
              bucket: 'project-blog-bucket',
            },
          },
        );
        return response;
      }
    });
  }

  public async putObject(bucketName, key, body) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: Buffer.from(body.data),
    };
    console.log(params)
    this.s3.putObject(params, (err, data) => {
      if (err) {
        console.error('Error putting object:', err);
      } else {
        console.log('Object successfully uploaded:', data);
      }
    });
  }

  /**
   * get signed URL for download the media files to S3
   * @param bucketName
   * @param key
\   * @returns signed URL for download
   */
  public async getSignedUrlForDownload(bucketName, key) {
    return this.getSignedUrl('get', bucketName, key);
  }

  //s3 delete
  /**
   *
   * get signed URL for delete the media files to S3
   * @param bucketName
   * @param key
   * @returns
   */
  public async getSignedUrlForDelete(bucketName, key) {
    return this.getSignedUrl('delete', bucketName, key);
  }

  /**
   * uploadFile will upload file to s3 bucket
   * @param file
   * @param key
   * @returns
   */
  public async uploadFile(bucketName, file, key) {
    const params = {
      Bucket: bucketName,
      Key: String(key),
      Body: file,
    };
    return this.s3.upload(params).promise();
  }

  /**
   * 
   * @param key 
   * @returns 
   */
  public readS3File(bucketName, key) {
    const params = {
      Bucket: bucketName,
      Key: String(key),
    };
    return new Promise((resolve, reject) => {
      this.s3.getObject(params, (err, data) => {
        if (err) {
          console.log(err.message, JSON.stringify(err), S3.name);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
  public async getMultipartUpload(bucketName, key) {
    const params = {
      Bucket: bucketName,
      Key: String(key),
    };
    const upload = await this.s3.createMultipartUpload(params).promise();
    return upload?.UploadId;
  }
  public async getCompleteMultipartUpload(bucketName, key, uploadId, parts) {
    const params = {
      Bucket: bucketName,
      Key: String(key),
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    };
    const completeMultipartUpload = await this.s3
      .completeMultipartUpload(params)
      .promise();
    return completeMultipartUpload?.Key;
  }
}
