const oss = require('ali-oss')
const fs = require('fs')
const path = require('path')

class S3Ali
{
	/**
	 * config is something like:
	 *  { accessKeyId: xxx, accessKeySecret: xxx, region: xxx, ... }
	 */
	constructor(bucketName, config)
	{
		this.s3 = new oss(
			Object.assign(config, { bucket: bucketName })
		)
	}

	putStream(filePath, stream)
	{
		return this.s3.putStream(filePath, stream)
	}

	putFile(filePath, fsPosition)
	{
		const f = fs.createReadStream(path.join(fsPosition, filePath))
		return this.s3.putStream(filePath, f)
	}

	async listFiles()
	{
		const rawRet = await this.s3.list()
		if (Array.isArray(rawRet.objects))
		{
			return rawRet.objects.map(({ name }) => name)
		}
		else
		{
			return []
		}
	}

	delFile(filePath)
	{
		return this.s3.delete(filePath)
	}
}

module.exports = S3Ali