import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { GameModel } from "../game/GameModel";

//分两种缓存
//1.缓存文件，加载的时候laya本身就会缓存，因此不用再做，量多的鱼线在运行时重新加载.其他的在游戏开始的时候加载
//2.缓存键值对，所有键值对都应该在使用的时候缓存。键值对文件在游戏进入的时候全部加载，和图片一起
export class ConfigerHelper{
    _configCachedValue: {};
    _configCachedFile: {};
    _configCachedFiles: {};
    testStr: string;
    static _Instance:any;
    static get Instance(){
        if (ConfigerHelper._Instance == null){
            ConfigerHelper._Instance = new ConfigerHelper;
        }

        return ConfigerHelper._Instance;
    }
    constructor() {
        this._configCachedValue = {};
        this._configCachedFile = {};
        this._configCachedFiles = {};
    }
    init() {
        this._configCachedValue = {};
        this._configCachedFile = {};
        this._configCachedFiles = {};
        this.testStr = "";
    }
    getCachedValue(path, key, value, firstKey) {
        if (this._configCachedValue[path] && this._configCachedValue[path][key] && this._configCachedValue[path][key][value]) {
            return GlobalFunc.clone(this._configCachedValue[path][key][value]);
        } else {
            var json = GameModel.getJson(path);
            if (json) {
                if (firstKey != null && json[firstKey]) {
                    json = json[firstKey];
                }
                for (var index in json) {
                    var v = json[index];
                    if (v && v[key] == value) {
                        this._configCachedValue[path] = {};
                        this._configCachedValue[path][key] = {};
                        this._configCachedValue[path][key][value] = v;
                        return GlobalFunc.clone(v);
                    }
                }
            }
        }
    }
    getCachedValueFirst(path, key, value, firstKey) {
        return this.getCachedValue(path, key, value, firstKey);
    }
    //用键取值
    getCachedValueByKey(path, key) {
        // var filePath = globalVar.reUrl + "config/" + path + ".json";
        var json;
        if (this._configCachedFiles[path]) {
            json = this._configCachedFiles[path];
        } else {
            json = GameModel.getJson(path);
            this._configCachedFiles[path] = json;
        }
        if (json) {
            var value = json[key[0]];
            for (var i = 1; i < key.length; i++) {
                if (!value) return;
                value = value[key[i]];
            }
            return value;
        }
    }
}