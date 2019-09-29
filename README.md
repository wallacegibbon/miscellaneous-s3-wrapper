## Introduction

This package is for Amazon S3(Simple Storage Service) compatible services.

It supports Aliyun OSS(Object Storage Service), Tecent COS(Cloud Object Storage),
and Sina SCS(Sina Cloud Storage).


## Installation

Using npm:

```shell
npm i @moontoad/s3
```


## Usage

```js
const { S3 } = require('@moontoad/s3')

let cli = new S3('tecent', 'mybucket', {
  SecretId: 'xxxxxxxxxx',
  SecretKey: 'xxxxxxxxxx',
})
// this will push the all files and directories in 'local/directory' to the bucket,
// with the same directory hierarchy
cli.putDirectory('local/directory')


// different S3 services have different option names
cli = new S3('ali', 'mybucket', {
  accessKeyId: 'xxxxxxxxxx',
  accessKeySecret: 'xxxxxxxxxx',
  region: 'oss-cn-shanghai',
})
cli.putDirectory('local/directory')


cli = new S3('sina', 'mybucket', {
  accessKeyId: 'xxxxxxxxxx',
  secretAccessKey: 'xxxxxxxxxxxxxxxx',
  sslEnabled: false,
})
cli.putDirectory('local/directory')
```

