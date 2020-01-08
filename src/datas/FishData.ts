export class FishData{
    static isInDaoDan: boolean;
    static fishNodesObj: any;
    static mySeatNode: any;
    static seatNodes: any;
    static isFiring: boolean;
    static bombId: any;
    static initFishData() {
        FishData.isTouching = false;
        FishData.isInDaoDan = false;
        FishData.isSelfBitTime = false;
        FishData.isSelfDragonTime = false;
        FishData.isDragonCannonOn = false;
        // FishData.isRoomFreezing = FishData.isFreezing = false;
    }

    /**我的位置 */        
    static mySeatIndex = 1;
    /**是否是自己钻头时间 */        
    static isSelfBitTime = false;
    /**是否是自己鸿运时间 */        
    static isSelfHyTime = false;
    /**是否是自己的龙炮时间 */        
    static isSelfDragonTime = false;
    /**龙炮面板是否打开 */        
    static isDragonCannonOn = false;
    /**鸿运时间是否可以 开炮 */        
    static hyCanFire = false;
    /**是否正在锁定中 */
    // public static isLocking: boolean = false;
    // public static isStartLock: boolean = false;
    /**是否有冰冻中 */
    // public static isFreezing: boolean = false;
    // public static isRaging: boolean = false;
    static skillCd = [];
    //长按鼠标
    static isTouching = false;
    /**自动开炮按钮on */        
    static isAutoButtonOn = false;
    static isShake = false;
    //摇一摇
    static isshowSc = true;
    static isInEditer = false;
    static stopPop = false;
    //渔场礼包推送
    static popCount = 0;
    //当次已推送次数
    static shakeTime = 0;
    //摇一摇倒计时
    static inDaodan = false;
    //客户端打开导弹界面
    static popindex = 0;
    //渔场内金币不足弹出下标
    static isVipBattle = false;
    static vipFishIndex = 0;
}