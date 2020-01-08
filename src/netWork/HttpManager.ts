import GlobalFunc from "../GlobalFuncs/GlobalFunc";

export class HttpManager{
	static _Instance:any;
	hr: Laya.HttpRequest;
	useUrl: string;
	responseTimer: number;
    static get Instance(){
        if (HttpManager._Instance == null){
            HttpManager._Instance = new HttpManager;
        }

        return HttpManager._Instance;
    }
	constructor() {}
	DecodeMessage(message) {
		var msg = message;
	}
	onHttpRequestError(e) {
		GlobalFunc.log("http请求出错：----1");
		GlobalFunc.log(e);
		GlobalFunc.log("http请求出错：-----2");
	}
	onHttpRequestProgress(e) {}
	connect(url, callBack, method = null, head = [], data) {
		this.hr = new Laya.HttpRequest();
		this.hr.once(Laya.Event.PROGRESS, this, this.onHttpRequestProgress);
		this.hr.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete, [ this.hr, callBack ]);
		this.hr.once(Laya.Event.ERROR, this, this.onHttpRequestError);
		if (url.indexOf("statistic") <= 0) {
			GlobalFunc.log("http Send:", url);
		}
		if (method == "post") {
			this.hr.send(url, data, "post", "text");
		} else {
			this.hr.send(url, null, "get", "text");
		}
	}
	onHttpRequestComplete(hr, callBack = undefined, e) {
		clearTimeout(this.responseTimer);
		if (hr.data && hr.data.length < 500) {
			GlobalFunc.log("http rec:", hr.data);
		}
		var data = JSON.parse(hr.data);
		if (!data) return;
		GlobalFunc.log("http.ret:" + data.ret);
		// var ret = globalFun.filterMsg(data);
		// if(!ret && data.ret) return;
						if (callBack) {
			callBack(data);
		}
	}
	/**向php请求公告 */            
	getNoticeData() {
		return this.useUrl + "announcement.php";
	}
}