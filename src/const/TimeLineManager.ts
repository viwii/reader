export class TimeLineManager{
	static _Instance:any;
	timeLines: {};
	timeLinesNum: number;
	timeLinescnt: number;
    static get Instance(){
        if (TimeLineManager._Instance == null){
            TimeLineManager._Instance = new TimeLineManager;
        }

        return TimeLineManager._Instance;
    }
	constructor() {
	this.timeLines = {};
		//timeline数组集合
	this.timeLinesNum = 0;
		//当前timeline数量
	this.timeLinescnt = 0;
		//自加变量
	}
	init() {
		this.timeLinescnt = 0;
		this.timeLinesNum = 0;
		this.timeLines = {};
		// this.initEvent();
	}
	// initEvent() {
	//     g_EventDis.addEvntListener("leave_room", this, this.clearTimeLines);
	//     g_EventDis.addEvntListener("replace_scene", this, this.clearTimeLines); 
	// }
	/**创建timeline，创建后不用管理生命周期，若需要删除，使用reset
     * @param loop 如果循环播放，则需要手动管理生命周期,如果不管理，则统一在切场景的时候删除，默认false
     */
	creatTimeLine(loop = false) {
		this.timeLines[this.timeLinescnt] = Laya.Pool.getItemByClass("timeLine", Laya.TimeLine);
		this.timeLines[this.timeLinescnt].name = this.timeLinescnt;
		!loop && this.timeLines[this.timeLinescnt].on(Laya.Event.COMPLETE, this, function(index) {
			delete this.timeLines[index];
		}, [ this.timeLinescnt ]);
		return this.timeLines[this.timeLinescnt++];
	}
	clearTimeLines() {
		for (let i in this.timeLines) {
			this.timeLines[i].reset();
		}
		this.timeLines = {};
	}
}