import { SceneManager } from "../../common/SceneManager";
import GlobalFunc from "../../GlobalFuncs/GlobalFunc";
import { BattleData } from "../../datas/BattleData";
import { WaitManager } from "../../common/WaitManager";

export class  UIType {
    /**
    * 基础
    */        
    static BASE = "BASE";
    /**
    * 场景
    */        
    static SCENE = "SCENE";
    /**
    * 窗口
    */        
    static DIALOG = "DIALOG";
    /**
    * 显示对象
    */        
    static DISPLAY = "DISPLAY";
}


export class UIUtils{
    /**
     * 界面列表
     */
    static viewMap = {};
    /**
     * 基础层
     */            
    static  baseLayer;
    /**
     * 场景层
     */            
    static  sceneLayer;
    /**
     * 窗口层
     */            
    static  dialogLayer;
    /**
     * 初始化界面管理器
     */ 
    constructor(){
        
    }

    static init() {
            
        UIUtils.baseLayer = new Laya.Sprite();
        UIUtils.sceneLayer = new Laya.Sprite();
        UIUtils.dialogLayer = new Laya.Sprite();
        Laya.stage.addChild(UIUtils.baseLayer);
        Laya.stage.addChild(UIUtils.sceneLayer);
        Laya.stage.addChild(UIUtils.dialogLayer);
    }
    /**
     * 显示界面
     * @param classInt  界面类
     * @param uiType    UI类型，若为UIType.DISPLAY则必须指定父级对象
     * @param parent
     * @param data
     *
     */            
    static show(classInt, uiType, parent = null) {
        Laya.loader.load(Laya.ResourceVersion.addVersionPrefix("res/atlas2/scene/" + classInt.name + ".atlas"), Laya.Handler.create(this, () => {
            let view = new classInt();
            if (uiType == UIType.SCENE) {
                UIUtils.sceneLayer.addChild(view);
            } else if (uiType == UIType.DIALOG) {
                UIUtils.dialogLayer.addChild(view);
            } else if (uiType == UIType.DISPLAY) {
                if (parent) parent.addChild(view); else console.warn("[" + classInt.name + "]父级不存在！");
            } else if (uiType == UIType.BASE) {
                UIUtils.baseLayer.addChild(view);
            }
            view.anchorX = .5;
            view.anchorY = .5;
            view.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            UIUtils.viewMap[classInt.name] = view;
        }));
    }
    /**
     *
     * @param classInt 关闭界面
     */            
    static hide(classInt) {
        let view = UIUtils.viewMap[classInt.name];
        if (view.parent) view.parent.removeChild(view);
        delete UIUtils.viewMap[classInt.name];
    }
    
    /**
     * 处理一些特殊的界面显示方式
     * @param className
     * @param that
     * @param callBack
     */            
    static showDisplay(className, that, callBack) {
        if (Laya.loader.getRes("res/atlas2/scene/" + className + ".atlas")) {
            console.log(className + "已加载");
            // new Laya.Handler(that, callBack)
                                callBack.apply(that);
            return;
        }
        WaitManager.Instance.showWaitLayer("UIUtils_loadingView", 60);
        Laya.loader.load(Laya.ResourceVersion.addVersionPrefix("res/atlas2/scene/" + className + ".atlas"), new Laya.Handler(this, () => {
            callBack.apply(that);
            WaitManager.Instance.hideWaitLayer("UIUtils_loadingView");
        }));
    }
        
    /**
     *
     * @param fishId 创建鱼序列帧动画
     * @param frameCount
     * @param that
     * @param callBack
     */            
    static createFish(fishId, frameCount, that, callBack) {
        // console.log('当前场景：' + g_SceneManager.curSceneName)
        // if (g_SceneManager.curSceneName != 'FishScene') return;
        if (BattleData.Instance.scene_type === null) return;
        var resUrl = GlobalFunc.getFrameArr(fishId, frameCount);
        if (Laya.loader.getRes("fishes/" + fishId + "/" + fishId + "_1.png")) {
            callBack.apply(that);
            return;
        }
        // console.log(fishId + '加载...');
                        Laya.loader.clearUnLoaded;
        Laya.loader.load(Laya.ResourceVersion.addVersionPrefix("res/atlas2/fishes/" + fishId + ".atlas"), new Laya.Handler(this, () => {
            // console.log('场景：' + g_SceneManager.curSceneName)
            if (SceneManager.Instance.curSceneName != "FishScene") return;
            Laya.Animation.createFrames(resUrl, fishId);
            // console.log('加载完成：' + fishId)
                                callBack.apply(that);
        }), null, Laya.Loader.ATLAS, 1, false, "", false, false);
    }
    
    /**
     *
     * @param fishId 创建鱼种图标
     * @param frameCount
     * @param that
     * @param callBack
     */            
    static loadFishIcon(icon, caller, method) {
        var resUrl = "res/icon/" + icon + ".png";
        if (Laya.loader.getRes("res/icon/" + icon + ".png")) {
            method.apply(caller);
            return;
        }
        Laya.loader.load(Laya.ResourceVersion.addVersionPrefix(resUrl), new Laya.Handler(this, () => {
            method.apply(caller);
        }));
    }
    
    static calcFps(debounce = 1e3) {
        let lastTime = Date.now();
        let count = 0;
        // 记录decounce周期内渲染次数
        // 记录decounce周期内渲染次数
                        // 记录decounce周期内渲染次数
        // 记录decounce周期内渲染次数
        (function loop() {
            count++;
            const now = Date.now();
            if (now - lastTime > debounce) {
                const fps = Math.round(count / ((now - lastTime) / 1e3));
                lastTime = now;
                count = 0;
                console.log("fps:", fps);
            }
            requestAnimationFrame(loop);
        })();
    }
}