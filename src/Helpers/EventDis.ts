import GlobalFunc from "../GlobalFuncs/GlobalFunc"

export class EventDis extends Laya.EventDispatcher{
    static _Instance:any;
    _eventPair: any[];
    EventDis: any;
    constructor() {
        super();
        this.EventDis = new Laya.EventDispatcher();
        this._eventPair = new Array();
    }
    static get Instance(){
        if (EventDis._Instance == null){
            EventDis._Instance = new EventDis;
        }

        return EventDis._Instance;
    }

    dispatchEvent(eventName, data = undefined) {
        Laya.stage.event(eventName, [ data ]);
    }
    addEvntListener(eventName, caller, listener, data = undefined) {
        Laya.stage.on(eventName, caller, listener);
        var cName = GlobalFunc.getClassName(caller);
        if (caller.name) cName = caller.name;
        // globalFun.log("add ",cName,eventName)
                        if (cName && !this._eventPair[cName]) {
            this._eventPair[cName] = {};
        }
        this._eventPair[cName][eventName] = listener;
    }
    delAllEvnt(caller) {
        var cName = GlobalFunc.getClassName(caller);
        if (caller.name) cName = caller.name;
        if (!this._eventPair[cName]) return;
        // globalFun.log("del all",cName)
                        for (var eventName in this._eventPair[cName]) {
            var listener = this._eventPair[cName][eventName];
            if (listener) {
                Laya.stage.off(eventName, caller, listener);
                //  globalFun.log("    del ",cName,eventName)
                                        delete this._eventPair[cName][eventName];
            }
        }
    }
    delEventName(eventName, caller) {
        var cName = GlobalFunc.getClassName(caller);
        if (caller.name) cName = caller.name;
        if (!this._eventPair[cName]) return;
        var listener = this._eventPair[cName][eventName];
        if (listener) {
            // globalFun.log("del ",cName,eventName)
            Laya.stage.off(eventName, caller, listener);
            delete this._eventPair[cName][eventName];
        }
    }
}
