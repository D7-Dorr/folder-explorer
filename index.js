var fs = require('fs')
var path = require('path')

//调用文件遍历方法
// fileDisplay(filePath)

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay (filePath) {
	// 根据文件路径读取文件，返回文件列表
	fs.readdir(filePath, function (err, files) {
		if (err) {
			console.warn(err)
		} else {
			// 遍历读取到的文件列表
			files.forEach(function(filename){
				// 获取当前文件的绝对路径
				var filedir = path.join(filePath,filename)
				// 根据文件路径获取文件信息，返回一个fs.Stats对象
				fs.stat(filedir,function(eror,stats){
					if (eror) {
						console.warn('获取文件stats失败')
					} else {
						var isFile = stats.isFile() // 是文件
						var isDir = stats.isDirectory() // 是文件夹
						if (isFile) {
							console.log(filedir)
						}
						if (isDir) {
							fileDisplay(filedir) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
						}
					}
				})
			})
		}
	})
}

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


