export class SpineManager{
	static _Instance:any;
	spineLoadNum: {};
    static get Instance(){
        if (SpineManager._Instance == null){
            SpineManager._Instance = new SpineManager;
        }

        return SpineManager._Instance;
    }
	constructor() {
		/**spine文件加载次数 */
		this.spineLoadNum = {};
	}
	/**获取读取数量 */            
	getLoadNum(fileName) {
		let num = this.spineLoadNum[fileName];
		if (num > 0 || num == 0) {
			this.spineLoadNum[fileName]++;
		} else {
			num = this.spineLoadNum[fileName] = 0;
		}
		return num;
	}
}