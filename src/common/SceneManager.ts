import GlobalConst from "../const/GlobalConst";
import {EventDis} from "../Helpers/EventDis"
import GlobalFunc from "../GlobalFuncs/GlobalFunc";
import { TimeLineManager } from "../const/TimeLineManager";

export class SceneManager{
    _curSceneName: string;
    _layers: Object;
    _rootLayer: Laya.Sprite;
    currentLayer: any;
    static _Instance:any;
    static get Instance(){
        if (SceneManager._Instance == null){
            SceneManager._Instance = new SceneManager;
        }

        return SceneManager._Instance;
    }
    constructor() {
        this._curSceneName = "";
    }
    init() {
        this._layers = new Object();
        this._rootLayer = new Laya.Sprite();
        this._curSceneName = "";
        Laya.stage.addChild(this._rootLayer);
        //暂时写到这里，以后写成常量文件
                        this.initLayers();
    }
    initLayers() {
        var bgLayer = new Laya.Sprite();
        var hallBtnLayer = new Laya.Sprite();
        var uiLayer = new Laya.Sprite();
        var roLayer = new Laya.Sprite();
        var bulletLayer = new Laya.Sprite();
        var btnsLayer = new Laya.Sprite();
        var cannonLayer = new Laya.Sprite();
        var dialogLayer = new Laya.Sprite();
        var effectLayer = new Laya.Sprite();
        var effectTopLayer = new Laya.Sprite();
        var effectBottomLayer = new Laya.Sprite();
        var testLayer = new Laya.Sprite();
        var maskLayer = new Laya.Sprite();
        var broadCastlayer = new Laya.Sprite();
        var freezeLayer = new Laya.Sprite();
        var frontDialogLayer = new Laya.Sprite();
        this._layers = new Object();
        this._layers[GlobalConst.bgLayer] = bgLayer;
        this._layers[GlobalConst.hallBtnLayer] = hallBtnLayer;
        this._layers[GlobalConst.uiLayer] = uiLayer;
        this._layers[GlobalConst.roLayer] = roLayer;
        this._layers[GlobalConst.freezeLayer] = freezeLayer;
        this._layers[GlobalConst.bulletLayer] = bulletLayer;
        this._layers[GlobalConst.effectBottomLayer] = effectBottomLayer;
        this._layers[GlobalConst.btnsLayer] = btnsLayer;
        this._layers[GlobalConst.cannonLayer] = cannonLayer;
        this._layers[GlobalConst.effectLayer] = effectLayer;
        this._layers[GlobalConst.effectTopLayer] = effectTopLayer;
        // this._layers[GlobalConst.testLayer] = testLayer
        this._layers[GlobalConst.maskLayer] = maskLayer;
        this._layers[GlobalConst.broadCastLayer] = broadCastlayer;
        this._layers[GlobalConst.dialogLayer] = dialogLayer;
        this._layers[GlobalConst.frontDialogLayer] = frontDialogLayer;
        this._rootLayer.addChild(bgLayer);
        this._rootLayer.addChild(hallBtnLayer);
        this._rootLayer.addChild(uiLayer);
        this._rootLayer.addChild(roLayer);
        this._rootLayer.addChild(freezeLayer);
        this._rootLayer.addChild(bulletLayer);
        this._rootLayer.addChild(effectBottomLayer);
        this._rootLayer.addChild(cannonLayer);
        this._rootLayer.addChild(btnsLayer);
        this._rootLayer.addChild(effectLayer);
        this._rootLayer.addChild(effectTopLayer);
        // this._rootLayer.addChild(testLayer);
        this._rootLayer.addChild(maskLayer);
        this._rootLayer.addChild(broadCastlayer);
        this._rootLayer.addChild(dialogLayer);
        this._rootLayer.addChild(frontDialogLayer);
        //testLayer.zOrder = 4100;
        bgLayer.zOrder = 1e3;
        hallBtnLayer.zOrder = 2e3;
        uiLayer.zOrder = 3e3;
        freezeLayer.zOrder = 4e3;
        roLayer.zOrder = 5e3;
        bulletLayer.zOrder = 6e3;
        effectBottomLayer.zOrder = 6500;
        cannonLayer.zOrder = 7e3;
        effectLayer.zOrder = 7500;
        btnsLayer.zOrder = 8e3;
        effectTopLayer.zOrder = 8500;
        broadCastlayer.zOrder = 9e3;
        maskLayer.zOrder = 9500;
        dialogLayer.zOrder = 1e4;
        frontDialogLayer.zOrder = 10500;
    }
    getLayerByName(layerName) {
        return this._layers[layerName];
    }
    addToLayer(layer, layerName, posX = undefined, posY = undefined) {
        EventDis.Instance.dispatchEvent("addDlg");
        if (layerName == GlobalConst.testLayer) {
            Laya.stage.addChild(layer);
            layer.zOrder = 1e3;
            return;
        }
        var baseLayer = this._layers[layerName];
        if (baseLayer) {
            baseLayer.addChild(layer);
            if (posX && posY) {
                layer.anchorX = .5;
                layer.anchorY = .5;
                layer.pos(posX, posY);
            }
        } else {
            GlobalFunc.log("layer not found");
        }
    }
    //适配居中对齐
    addToMiddLayer(layer, layerName, x = 0, y = 0) {
        EventDis.Instance.dispatchEvent("addDlg");
        var baseLayer = this._layers[layerName];
        if (baseLayer) {
            baseLayer.addChild(layer);
            layer.anchorX = .5;
            layer.anchorY = .5;
            layer.pos(Laya.stage.width / 2 + x, Laya.stage.height / 2 + y);
            if (layer.box_dialog) {
                layer.box_dialog.width = Laya.stage.width > 1630 ? 1630 : Laya.stage.width;
            }
        } else {
            GlobalFunc.log("mid layer not found");
        }
    }
    clearLayer(layerName) {
        var baseLayer = this._layers[layerName];
        if (baseLayer) {
            baseLayer.destroyChildren();
            // baseLayer.removeSelf();
                        } else {
            GlobalFunc.log("layer not found");
        }
    }
    //引导层，自关闭，不收manager管理
    pushMaskScene(scene) {
        EventDis.Instance.dispatchEvent("replace_scene");
        TimeLineManager.Instance.clearTimeLines();
        if (this._rootLayer != null) {
            this._rootLayer.destroyChildren();
            this._rootLayer.removeSelf();
            this._rootLayer.destroy();
            this._rootLayer = null;
        }
        this.init();
        var sceneLayer = this.getSceneByName(scene);
        if (sceneLayer) {
            Laya.stage.addChild(sceneLayer);
            sceneLayer.anchorX = .5;
            sceneLayer.anchorY = .5;
            sceneLayer.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            sceneLayer.zOrder = 100;
        }
    }
    replaceScene(scene, args = null, delayTime = 0) {
        if (scene == this._curSceneName) return this.currentLayer;
        // this._curSceneName = scene;
            if (scene == "LoadingScene" || scene == "FlyWarLoadScene" || scene == "FlyFightingScene" || scene == "jumpLoadScene" || scene == "LoadingScene_H5APP") {
            this._clearRootLayer();
            this._openScene(scene);
        } else {
            Laya.loader.load(Laya.ResourceVersion.addVersionPrefix("res/atlas2/scene/" + scene + ".atlas"), Laya.Handler.create(this, () => {
                this._clearRootLayer();
                this._openScene(scene);
            }), null, null, 1, true, null, false, true);
        }
    }
    _clearRootLayer() {
        EventDis.Instance.dispatchEvent("replace_scene");
        TimeLineManager.Instance.clearTimeLines();
        if (this._rootLayer != null) {
            this._rootLayer.destroyChildren();
            this._rootLayer.removeSelf();
            this._rootLayer.destroy();
            this._rootLayer = null;
        }
        this.init();
    }
    get curSceneName() {
        return this._curSceneName;
    }
    set curSceneName(value) {
        this._curSceneName = value;
    }
    _openScene(scene) {
        var sceneLayer = this.getSceneByName(scene);
        this.currentLayer = sceneLayer;
        this._curSceneName = scene;
        if (sceneLayer) {
            this.addToMiddLayer(sceneLayer, GlobalConst.uiLayer);
        }
    }
    getSceneByName(scene) {
        var sceneLayer = undefined;
        // if (scene == "FishScene") {
        //     sceneLayer = new FishScene_1.FishScene();
        // } else if (scene == "FirstHallScene") {
        //     sceneLayer = new FirstHallScene();
        // } else if (scene == "FishLoadingScene") {
        //     sceneLayer = new FishLoadScene_1.FishLoadingScene();
        // } else if (scene == "jumpLoadScene") {
        //     sceneLayer = new jumpLoadScene_1.jumpLoadScene();
        // } else if (scene == "VipDlg") {
        //     sceneLayer = new VipDlg_1.VipDlg();
        // } else if (scene == "NewRoomChangeDlg") {
        //     sceneLayer = new NewRoomChangeDlg_1.NewRoomChangeDlg();
        // } else if (scene == "LoadingScene") {
        //     sceneLayer = new LoadingScene();
        // } else if (scene == "LoadingScene_H5APP") {
        //     sceneLayer = new LoadingScene_H5APP();
        // }
        return sceneLayer;
    }
    clearScene() {
        this._curSceneName = "";
        this._rootLayer.destroyChildren();
        this.initLayers();
    }
    /**
    * 清除当前显示的场景
    */            
    clearCurrentScene() {
        if (this.currentLayer != null) {
            this.currentLayer.destroyChildren();
            this.currentLayer.removeSelf();
            this.currentLayer.destroy();
            this.currentLayer = null;
        }
    }
}