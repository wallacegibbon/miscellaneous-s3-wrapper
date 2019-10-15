const Tecent = require('./src/Tecent')
const Sina = require('./src/Sina')
const Ali = require('./src/Ali')
const fs = require('fs')
const path = require('path')


class S3 {
	/**
	 * s3 is an object who have implemented these methods: putFile, listFiles, delFile
	 */
	constructor(type, bucket, config) {
		switch (type) {
			case 'tecent':
				this.s3 = new Tecent(bucket, config)
				break
			case 'sina':
				this.s3 = new Sina(bucket, config)
				break
			case 'ali':
				this.s3 = new Ali(bucket, config)
				break
			default:
				throw new Error(`unknown S3 type: ${type}`)
		}
	}

	async putDirectory(fsPosition) {
		await this.putDirectoryRec1(fsPosition, '')
	}

	async putDirectoryRec1(fsPosition, currentPath) {
		const child = await readdir(path.join(fsPosition, currentPath))
		for (let d of child) {
			await this.putDirectoryRec2(fsPosition, currentPath, d)
		}
	}

	async putDirectoryRec2(fsPosition, currentPath, name) {
		// when currentPath is '', there should not be a '/' before path
		const fPath = currentPath ? `${currentPath}/${name}` : name
		const fStat = await lstat(`${fsPosition}/${currentPath}/${name}`)
		if (!fStat.isDirectory()) {
			console.log(`pushing file "${fPath}" to remote...`)
			await this.putFile(fPath, fsPosition)
		} else {
			await this.putDirectoryRec1(fsPosition, fPath)
		}
	}

	async clearBucket() {
		const files = await this.listFiles()
		for (let f of files) {
			console.log(`deleting file ${f}...`)
			await this.delFile(f)
		}
	}

	listFiles() {
		return this.s3.listFiles()
	}

	putFile(fPath, fsPosition) {
		return this.s3.putFile(fPath, fsPosition)
	}

	putStream(fPath, stream) {
		return this.s3.putStream(fPath, stream)
	}

	delFile(filePath) {
		return this.s3.delFile(filePath)
	}
}

function lstat(fileName) {
	return new Promise((res, rej) =>
		fs.lstat(fileName, (err, stats) => err ? rej(err) : res(stats)))
}

function readdir(dirName) {
	return new Promise((res, rej) =>
		fs.readdir(dirName, (err, files) => err ? rej(err) : res(files)))
}

module.exports = {
	S3,
}