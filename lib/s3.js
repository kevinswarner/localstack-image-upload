import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutObjectCommand,
  PutBucketCorsCommand,
  GetBucketCorsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ENDPOINT = "http://localhost:4566";
const REGION = "us-east-1";
const BUCKET = "foobar";

const client = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: "FOO",
    secretAccessKey: "BAR",
  },
});

export const bucketExists = async () => {
  const command = new HeadBucketCommand({ Bucket: BUCKET });
  try {
    const response = await client.send(command);
    return response["$metadata"].httpStatusCode === 200;
  } catch (error) {
    return false;
  }
};

export const ensureBucket = async () => {
  const exists = await bucketExists();
  if (!exists) {
    const command = new CreateBucketCommand({
      Bucket: BUCKET,
    });
    return client.send(command);
  }
};

export const getUploadUrl = (key, type) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: type,
  });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};
