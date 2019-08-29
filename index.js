var fs = require('fs')
var path = require('path')

/**
 * 返回传入目录的子文件数据
 * @param {String} filePath 文件目录
 */
async function getFiles (filePath) {
	let result = []
	const files = await fs.readdirSync(filePath)
	for (const filename of files) {
		const fileDirFull = path.join(filePath, filename)
		const stat = await fs.statSync(fileDirFull)
		const isFile = stat.isFile()
		const isDirectory = stat.isDirectory()
		result.push({
			nameFull: filename,
			name: path.parse(filename).name,
			...stat.isFile() ? {
				ext: path.extname(filename)
			} : {},
			isFile,
			isDirectory,
			size: stat.size,
			...stat.isDirectory() ? {
				children: await getFiles(fileDirFull)
			} : {}
		})
	}
	return result
}

function saveFile (fileName = '', text = '') {
	const writeData = new Uint8Array(Buffer.from(text))
	fs.writeFile(`./${fileName}`, writeData, (err) => {
		if (err) throw err
		console.log('文件已被保存')
	})
}

;(async function () {
	saveFile('数据.txt', JSON.stringify(await getFiles(path.resolve('/Users/liyang/Documents/code/blog')), null, 2))
})()
