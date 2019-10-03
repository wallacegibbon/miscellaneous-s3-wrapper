const scs = require('scs-sdk')
const fs = require('fs')
const path = require('path')


class S3Sina {
  /**
   * config is something like:
   *  { accessKeyId: xxx, secretAccessKey: xxx, sslEnabled: false, ... }
   */
  constructor(bucketName, config) {
    this.s3 = new scs.S3()
    this.s3.config = new scs.Config(config)
    this.bucket = bucketName
  }

  putStream(filePath, stream) {
    const params = { ACL: 'public-read', Bucket: this.bucket, Key: filePath, Body: stream }
    return this.putObject(params)
  }

  putFile(filePath, fsPosition) {
    const f = fs.createReadStream(path.join(fsPosition, filePath))
    const params = { ACL: 'public-read', Bucket: this.bucket, Key: filePath, Body: f }
    return this.putObject(params)
  }

  async listFiles() {
    const rawRet = await this.listObjects({ Bucket: this.bucket })
    return rawRet.Contents.map(({ Key }) => Key)
  }

  delFile(filePath) {
    const params = { Bucket: this.bucket, Key: filePath }
    return this.delObject(params)
  }

  putObject(params) {
    return new Promise((res, rej) => {
      this.s3.putObject(params, (err, r) => err ? rej(err) : res(r))
    })
  }

  listObjects(params) {
    return new Promise((res, rej) => {
      this.s3.listObjects(params, (err, r) => err ? rej(err) : res(r))
    })
  }

  delObject(params) {
    return new Promise((res, rej) => {
      this.s3.deleteObject(params, (err, r) => err ? rej(err) : res(r))
    })
  }
}

module.exports = S3Sina