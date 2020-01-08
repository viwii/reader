import GlobalVar from "../const/GlobalVar";
import GlobalFunc from "./GlobalFunc";

export class WxFuncs{
	//文件和目录是否存在
	static isDirExistSyn(path) {
		try {
			GlobalVar.fswx.accessSync(path);
			return true;
		} catch (err) {
			return false;
		}
	}
	
	static isDirExist(path, callBack) {
		GlobalVar.fswx.access({
			path: path,
			success() {
				if (callBack) {
					callBack(true);
				}
			},
			fail() {
				if (callBack) {
					callBack(false);
				}
			},
			complete() {}
		});
	}
	
	/**复制文件 */            
	static copyFile(param) {
		GlobalVar.fswx.copyFile({
			srcPath: param.remotePath,
			destPath: param.localPath,
			success(evt) {
				if (param.callBack) {
					param.callBack(true);
				}
			},
			fail(evt) {
				if (param.callBack) {
					param.callBack(false);
				}
			}
		});
	}
	
	/**目录下的文件列表 */            
	static getFileList(path) {
		var arr;
		try {
			return GlobalVar.fswx.readdirSync(path);
		} catch (err) {
			GlobalFunc.log("获取文件列表，目录不存在", path);
			return false;
		}
	}
	
	/**递归显示所有文件 */            
	static logRecFileList(filePath) {
		var deletePath = filePath;
		var fileList = WxFuncs.getFileList(filePath);
		if (!fileList) return;
		for (var index = 0; index < fileList.length; index++) {
			var element = fileList[index];
			var name = filePath + element + "/";
			if (element.indexOf(".") > -1) {
				GlobalFunc.log(name);
			} else {
				GlobalFunc.log(name);
				WxFuncs.getFileList(name);
			}
		}
	}
	
	/**建立目录,少数机型不支持递归建立目录，大部分支持 */            
	static mkdirSync(path) {
		try {
			GlobalVar.fswx.mkdirSync(path, true);
			GlobalFunc.log("创建目录成功" + path);
		} catch (err) {
			GlobalFunc.log("建立目录失败:", err);
			return false;
		}
	}
	
	/**重命名文件/目录 */            
	static renameSync(path) {
		try {
			GlobalVar.fswx.renameSync(path, true);
		} catch (err) {
			GlobalFunc.log("重命名文件失败:", err);
			return false;
		}
	}
	
	/**递归删除文件 */            
	static removefiles(filePath, isfirst) {
		var deletePath = filePath;
		var fileList = WxFuncs.getFileList(filePath);
		if (!fileList) return;
		for (var index = 0; index < fileList.length; index++) {
			var element = fileList[index];
			if (element.indexOf(".") > -1) {
				GlobalFunc.log("delf", filePath + element);
				GlobalVar.fswx.unlinkSync(filePath + "/" + element);
			} else {
				WxFuncs.removefiles(filePath + "/" + element, false);
			}
		}
		//删除顶层文件夹
		if (isfirst) {
			Laya.timer.once(500, null, () => {
				GlobalVar.fswx.rmdirSync(filePath, true);
			});
		}
	}
}