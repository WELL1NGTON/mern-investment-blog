const googleCloudOptions = Object.freeze({
  credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
  googleBucketName: process.env.GOOGLE_BUCKET_NAME as string,
});

export default googleCloudOptions;
