const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs')
const path = require('path')

class S3Tecent {
	/**
	 * config is something like: { SecretId: xxx, SecretKey: xxx, ... }
	 */
	constructor(bucketName, config) {
		this.s3 = new COS(config)
		this.bucket = bucketName
	}

	putStream(filePath, stream) {
		const params = { ACL: 'public-read', Bucket: this.bucket, Region: 'ap-shanghai', Key: filePath, Body: stream }
		return this.putObjectAcl(params)
	}

	putFile(filePath, fsPosition) {
		const f = fs.createReadStream(path.join(fsPosition, filePath))
		const params = { ACL: 'public-read', Bucket: this.bucket, Region: 'ap-shanghai', Key: filePath, Body: f }
		return this.putObjectAcl(params)
	}

	async listFiles() {
		const rawRet = await this.getBucket({ Bucket: this.bucket, Region: 'ap-shanghai' })
		return rawRet.Contents.map(({ Key }) => Key)
	}

	delFile(filePath) {
		const params = { Bucket: this.bucket, Key: filePath, Region: 'ap-shanghai' }
		return this.delObject(params)
	}

	putObjectAcl(params) {
		return new Promise((res, rej) => {
			this.s3.putObject(params, (err, r) => err ? rej(err) : res(r))
		})
	}

	getBucket(params) {
		return new Promise((res, rej) => {
			this.s3.getBucket(params, (err, r) => err ? rej(err) : res(r))
		})
	}

	delObject(params) {
		return new Promise((res, rej) => {
			this.s3.deleteObject(params, (err, r) => err ? rej(err) : res(r))
		})
	}
}

module.exports = S3Tecent