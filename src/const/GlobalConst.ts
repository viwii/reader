export default class GlobalConst {
        //zip下载版本
        static zipName = "test";
        //全局
        static accActionInterval = 50;
        //累积时间动作时间间隔
        //http url
        static phpUrl = "http://10.246.95.153/";
        static phpUrlOut = "https://bfby.gameabc2.com/";
        //登录请求URL
        static loginUrl151 = "http://10.246.95.151/login";
        //qa 专用
        static loginUrl152 = "https://10.246.95.152:14000/login";
        // 开发专用
        static loginUrlWanmiao = "https://10.244.105.71:14000/login";
        // wanmiao
        static loginUrlDongyanan = "http://10.244.105.42:14000/login";
        // dongyanan
        static loginUrlJin = "https://10.244.105.66:14000/login";
        // jincheng 
        static loginUrlOutQa = "https://dmzbuyu.gameabc2.com/qa/svr_pre/login";
        // 外网QA 
        static loginUrlOutForm = "https://dmzonline.gameabc2.com/buyuxia/svr/login";
        // 外网QA
        static loginUrlOutQa2 = "https://dmzbuyu.gameabc2.com/qa/svr/login";
        // 外网QA 
        static loginUrlOutForm2 = "https://dmzonline.gameabc2.com/buyuxia/svr2/login";
        // 外网QA
        static httpUrl = "";
        //渠道号
        static localChannel = "1100";
        static newJson = {};
        //公告请求URL
        static noticeUrl151 = "http://10.246.95.151/announcement";
        //qa 专用
        static noticeUrlOutQa = "https://dmzbuyu.gameabc2.com/qa/svr/announcement";
        // 外网QA 
        // order/pay pc地址
        static orderUrl151 = "http://10.246.95.151/pay/get_order_id";
        static orderUrl151Check = "http://10.246.95.151/pay/pay_order_by_id_nocheck";
        //支付地址
        //入口json地址
        static mainEntryUrl1 = "https://bfbyres.gameabc2.com/mainEntry.json?v=";
        static mainEntryUrQA = "https://dmzbuyu.gameabc2.com/qa/client/mainEntry.json?v=";
        static mainEntryUrForm = "https://dmzresonline.gameabc2.com/mainEntry.json?v=";
        static mainEntryUrForm1 = "https://dmzresonline.gameabc2.com/mainEntry1.json?v=";
        //场景管理
        static bgLayer = "bgLayer";
        static hallBtnLayer = "hallBtnLayer";
        static uiLayer = "uiLayer";
        static roLayer = "roLayer";
        static freezeLayer = "freezeLayer";
        static bulletLayer = "bulletLayer";
        static btnsLayer = "btnsLayer";
        static cannonLayer = "cannonLayer";
        static effectLayer = "effectLayer";
        static effectBottomLayer = "effectBottomLayer";
        static effectTopLayer = "effectTopLayer";
        static testLayer = "testLayer";
        static maskLayer = "maskLayer";
        static dialogLayer = "dialogLayer";
        static broadCastLayer = "broadCastLayer";
        static frontDialogLayer = "frontDialogLayer";
        //文字加载
        static fontNum1 = "numberFont1";
        static fontNum2 = "numberFont2";
        static fontNum3 = "numberFont3";
        static fontNum4 = "numberFont4";
        static fontNum5 = "numberFont5";
        static fontNum6 = "numberFont6";
        //苹果手机检测字段
        static iosSystem = "iOS";
        //手机操作系统
        static iosBrand = "iPhone";
        //手机类型
        //鱼
        static maxFishNum = 38;
        //最多鱼数据
        static maxFishFrame = 60;
        //鱼最多帧数
        static globalFishSpeed = 2;
        //鱼速度美术调整，数字越大，速度越慢
        //boss最大奖励分数
        static room1BossMaxSore = 500;
        static room2BossMaxSore = 650;
        static room3BossMaxSore = 800;
        static room4BossMaxSore = 500;
        //子弹
        static maxBulletFrame = 13;
        //子弹最多帧数
        static maxBulletNum = 40;
        //子弹总数上限
        static autoShootInterval = 200;
        //自动射击频率
        static netAniName = "boom2";
        //网炸弹效果
        static honyunAniName = "boomHy";
        //鸿运炸弹效果
        static daoDanEffect = "daoDanEffect";
        //鸿运炸弹效果
        static bombFishEffect1 = "bombFishEffect1";
        //炸弹鱼爆炸
        static bombFishEffect2 = "bombFishEffect2";
        //炸弹鱼爆炸特效
        static zuantouHit = "zuantouHit";
        //钻头击中
        //技能：锁定，狂暴
        static lockInterVal = 200;
        //锁定子弹设计频率
        static rageInterVal1 = 170;
        //狂暴1
        static rageInterVal2 = 140;
        //狂暴2
        //炮台
        static maxWaitFireTime = 5 * 60 * 1e3;
        //最大开炮等待时间，不开炮就踢出房间
        // 特色鱼
        static bitBoomRadius = 500;
        //钻头爆炸半径
        static bitFlyTime1 = 15e3;
        //钻头飞行时间1
        static bitFlyTime2 = 5e3;
        //钻头飞行时间2
        static bitFlySpeed1 = 15e3;
        //钻头飞行速度1
        static bitFlySpeed2 = 5e3;
        //钻头飞行速度2
        static bitCountDownSec = 15;
        //钻头倒计时
        static haiWangJiange = 200;
        //海王宝藏间隔
        static haiWangTime = 30;
        //海王宝藏持续时间
        static specialFishStartTime = 15;
        //通用特色鱼开始时间
        static specialFishEndTime = 90;
        //通用特色鱼结束时间
        //加减
        static reduce = -1;
        //减少
        static whit = 0;
        //等待
        static plus = 1;
        //增加
        static gold = 1;
        static diamond = 2;
        static zibi = 3;
        static ticket = 4;
        //背包操作键状态
        /**购买 */        
        static buy = "购买";
        /**赠送 */        
        static give = "赠送";
        /**续费 */        
        static renew = "续费";
        //物品状态
        /**没有 */        
        static number = 0;
        /**有 */        
        static numberHave = 1;
        /**无限 */        
        static infinite = -1;
        /**装备未拥有 */        
        static noEquipment = 3;
        /**装备拥有 */        
        static haveEquipment = 4;
        /**装备装备中 */        
        static equipped = 5;
        //物品ID
        /**游戏物品 */        
        static gameItemIDStart = 1;
        static gameItemIDEnd = 300;
        static netItemIDStart = 301;
        static netItemIDEnd = 400;
        static entityIDStart = 401;
        static entityIDEnd = 500;
        //商品类型
        /**月卡 */        
        static monthlyCard = "monthcard";
        /**新手礼包 */        
        static newPlayerBag = "newBiePack";
        /**新手礼包购买 */        
        static newPlayerBagBuy = "newbie";
        /**金币商品 */        
        static goldCoinComm = "gold_shop";
        /**钻石商品 */        
        static diamondsComm = "zuan_shop";
        /*限时礼包*/        
        static limitTimePacks = "limitPacks";
        /*限时礼包购买*/        
        static limitTimePacksBuy = "buyPack";
        /*启航礼包ID*/        
        static qihangID = "30";
        /*首充礼包ID*/        
        static firstPayID = "20";
        static commGoldStart = 110;
        static commGoldEnd = 1e3;
        static commdiamondStart = 1001;
        static commdiamondEnd = 2e3;
        static giftBag_Sv1 = 50100;
        static giftBag_Sv2 = 50200;
        static giftBag_Sv3 = 50300;
        static giftBag_Sv4 = 50400;
        static hongBaoIdMin = 80100;
        static hongBaoIdMax = 80500;
        /**奖励界面 */
        /**奖励界面的最大显示数 */        
        static maxItemNum = 5;
        /**单数间隔 */        
        static onlyInterval = 150;
        static doubleInterval = 200;
        //性别
        /**男 */        
        static man = 0;
        /**女 */        
        static woman = 1;
        //兑换物品类型
        /**实物 */        
        static ENTITY = "entity";
        /**网络物品 */        
        static NETITEM = "netItem";
        /**游戏物品 */        
        static GAMEITEM = "gameItem";
        /**打开状态 */        
        static OPEN = 1;
        /**关闭状态 */        
        static CLOSE = 0;
        //音乐&音效
        /**主场景 */        
        static Sud_bg_hall = "sound/bg_hall_music";
        /**boss场景 */        
        static Sud_bg_king = "sound/bg_king";
        /**新手房、1号房 */        
        static Sud_room1 = "sound/room1";
        /**2号房 */        
        static Sud_room2 = "sound/room2";
        /**3号房 */        
        static Sud_room3 = "sound/room5";
        static Sud_room20 = "sound/room20";
        /**点击 */        
        static Sud_click = "sound/click";
        /**开炮 */        
        static Sud_fire = "sound/fire";
        /**boss预警 */        
        static Sud_Boss_stage = "sound/Boss_stage";
        /**泡泡动画 */
        // public static Sud_bubble = "sound/bubble";
        /**获得奖励 */        
        static Sud_reward = "sound/reward";
        /**托盘 */        
        static Sud_CaiJinSound = "sound/CaiJinSound";
        /**导弹 */        
        static Sud_cannon_bomb = "sound/cannon_bomb";
        /**金币增加 */        
        static Sud_getGold = "sound/getDiamond";
        /**钻石增加 */        
        static Sud_getDiamond = "sound/getDiamond";
        /**新手引导入场 */        
        static Sud_NPC_OS_01 = "sound/NPC_OS_01";
        /**新手引导开炮 */        
        static Sud_NPC_OS_02 = "sound/NPC_OS_02";
        /**结算 */        
        static Sud_result_MiniWin = "sound/result_MiniWin";
        /**五龙宝石选取 */
        // public static Sud_Choice_bs = "sound/Choice_bs";
        /**龙亮起 */        
        static Sud_long_light = "sound/long_light";
        /**亮倍数 */        
        static Sud_beishu_fly = "sound/beishu_fly";
        /**倒计时 */        
        static Sud_count_down = "sound/count_down";
        /**宝箱金币掉落 */        
        static Sud_bx_gold = "sound/bx_gold";
        /**幸运转盘转动 */        
        static Sud_turn_gem = "sound/turn_gem";
        /**幸运转盘停止 */        
        static Sud_turn_stop = "sound/turn_stop";
        /**转盘停下获得奖励 */
        // public static Sud_turntable_stop = "sound/turntable_stop";
        /**点击贝壳 */
        // public static Sud_click_shell = "sound/click_shell";
        /**珍珠炸弹 */        
        static Sud_pearl_bomb = "sound/pearl_bomb";
        /**获得钻头蟹 */
        // public static Sud_drill_addgun = "sound/drill_addgun";
        /**钻头炮爆炸 */        
        static Sud_drill_bomb = "sound/drill_bomb";
        /**钻头炮击中 */
        // public static Sud_drill_bound = "sound/drill_bound";
        /**装备钻头炮 */
        // public static Sud_drill_ready = "sound/drill_ready";
        /**钻头炮命中 */
        // public static Sud_drill_shoot = "sound/drill_shoot";
        /**钻头炮结算 */
        // public static Sud_drill_title = "sound/drill_title";
        /**钻头炮待发射 */        
        static Sud_drill_uncon = "sound/drill_uncon";
        /**获得鸿运当头 */
        // public static Sud_get_Firestorm = "sound/get_Firestorm";
        /**装备鸿运当头 */
        // public static Sud_storm_addgun = "sound/storm_addgun";
        /**鸿运当头开炮 */        
        static Sud_storm_shoot = "sound/storm_shoot";
        /**鸿运当头结算 */        
        static Sud_storm_title = "sound/storm_title";
        /**每日转盘开始 */        
        static Sud_LuckyWheel_Start = "sound/LuckyWheel_Start";
        /**转盘结束 */        
        static Sud_LuckyWheel_Unlock = "sound/LuckyWheel_Unlock";
        /**鱼死亡0 */        
        static Sud_fishDead_0 = "sound/v007";
        //sound/death1
        /**鱼死亡1 */        
        static Sud_fishDead_1 = "sound/death2";
        /**鱼死亡2 */
        // public static Sud_fishDead_2 = "sound/death3";
        /**鱼死亡3 */
        // public static Sud_fishDead_3 = "sound/v002";
        /**鱼死亡4 */
        // public static Sud_fishDead_4 = "sound/v004";
        /**鱼死亡5 */
        // public static Sud_fishDead_5 = "sound/v007";
        /**鱼死亡6 */
        // public static Sud_fishDead_6 = "sound/v0012";
        /**音量值基础 */        
        static initVolumeNum = .1;
        //鸿运当头
        /**炮管皮肤 */        
        static HongYunSkin = "hongYun/hong_yun_001.png";
        //房间菜单
        static RoomMenu = "roomMenu";
        static RoomBottonCharge = "RoomBottonCharge";
        static RoomPao = "RoomPao";
        static RoomDaoDan = "RoomDaoDan";
        static RoomSkill = "RoomSkill";
        static RoomPackage = "RoomPackage";
        static RoomShop = "RoomShop";
        static RoomOpenBag = "RoomOpenBag";
        /**无用子弹编号 */        static ButtleSessUnused = -100;
        //特殊鱼ID
        /**钻头虾ID*/        static bitFishId = 240;
        /**鸿运当头ID*/        static hongyunFishId = 250;
        /**宝箱鱼ID*/        static baoxiangFishId = 260;
        /**贝壳鱼ID*/        static beikeFishId = 270;
        /**转盘鱼ID*/        static zhuanpanFishId = 280;
        /**龙珠鱼ID*/        static longzhuFishId = 290;
        /**舞台宽度 */        static stageW = 1630;
        /**舞台高度 */        static stageH = 750;
        static downloadTips = [ "加载配置中…", "正在下载游戏资源…", "正在解压和安装中…(不消耗流量)", "正在授权中…(不消耗流量)", "正在进入游戏..." ];
        static downloadTips1 = [ "加载配置中…", "正在下载游戏资源…", "正在解压和安装中…(不消耗流量)", "正在授权中…(不消耗流量)", "正在进入游戏..." ];
        static downloadFailTips = [ "网络不给力哦，请检查网络后再开启游戏", "您的网络开小差了，请重新连接" ];
        static buyFlag = 0;
        //设置购买时不能重复购买标记
        static ShareDmd = "shareDmd";
        //分享获取钻石
        static ShareGold = "shareGold";
        //分享获取金币
        static ShareAutoPao = "shareAutoPao";
        //分享获取自动开炮
        static ShareFreeDmd = "shareFreeDmd";
        //免费视频
        static ShareSignIn = "shareSignIn";
        //每日签到
        static rewardPaobei = "rewardPaobei";
        //奖励炮倍
        static rewardSkill = "rewardSkill";
        //奖励技能
        static rewardAlms = "rewardAlms";
        //奖励救济金
        static rewardAutoPao = "rewardAutoPao";
        //奖励自动开炮
        static rewardFreeDmd = "rewardFreeDmd";
        //奖励免费钻石
        static rewardSignIn = "rewardSignIn";
        //每日签到
        static getRewardPaoBei = 302500;
        //炮倍领取奖励
        static getRewardSkill = 302600;
        //技能领取奖励
        static getRewardAutoPao = 302700;
        //自动开炮领取奖励
        static getRewardAlms = 302800;
        //救济金大厅领取奖励
        static getRewardViewPaoBei = 303500;
        //炮倍视频领取奖励
        static getRewardViewSkill = 303600;
        //技能视频领取奖励
        static getRewardViewAlms = 303800;
        //救济金视频领取奖励
        static isFreezeCanUse = true;
        //切换场景前冰冻不可用
        static isLeaveDialogOn = false;
        //messagebox强制踢出游戏框是否已弹出
        /**默认头像地址 */        static defaultHead = "common/img_toux.png";
        /**礼包排序基数 */        static giftSortValue = 1e6;
        static newUserFishArr = [ "fish001", "fish002", "fish006", "fish009", "fish030", "fish10001" ];
        //2.0新静态变量
        //窗口名
        /**背包窗口 */        static DIA_PACKAGE = "PackageDialog";
        /**排行榜窗口 */        static DIA_RANKLIST = "RankingListDialog";
        /**海王榜窗口 */        static DIA_RANKINGWAR = "RankingWarDialog";
        /**公告窗口 */        static DIA_NOTICE = "NoticeDialog";
        /**商城窗口 */        static DIA_SHOP = "ShopDialog";
        /**VIP特权窗口 */        static DIA_VIPCHARGE = "VipDlg";
        /**用户信息 */        static DIA_PLAYERINFO = "PlayerDataDialog";
        /**客服窗口 */        static DIA_SERVICE = "ServiceTipsDialog";
        /**设置窗口 */        static DIA_SET = "SetDialog";
        /**兑换窗口 */        static DIA_EXCHANGEDLG = "ExChangeDlg";
        /**邮件窗口 */        static DIA_MAIL = "MailDialog";
        /**活动窗口 */        static DIA_ACTIVITY = "ActivityDialog";
        /**分享返利窗口 */        static DIA_SHARE = "share";
        /**月卡窗口 */        static DIA_MONTHCARD = "MonthCardDlg";
        /**首冲礼包窗口 */        static DIA_FIRSTPAY = "GiftScDlg";
        /**特惠礼包窗口 */        static DIA_PREFERENTIAL = "GiftKyDlg";
        /**新特惠礼包窗口 */        static DIA_NEWTHGIFT = "GiftNewThDlg";
        /**明日礼包窗口 */        static DIA_SECONDDAY = "GiftMrDlg";
        /**摇一摇礼包窗口 */        static DIA_GIFTSHAKE = "GiftShakeDlg";
        /**幸运抽奖窗口 */        static DIA_LUCKYDRAW = "ActivityLuckDlg";
        /**免费金币ICON窗口 */        static DIA_FreeGold = "freeGoldDlg";
        /**捕鱼返奖券窗口 */        static DIA_REBATE = "ActivityRebateDlg";
        /**鱼鉴窗口 */        static DIA_FISHMAP = "FishMapDialog";
        /**登陆转盘窗口 */        static DIA_ROULETTE = "RouletteDialog";
        /**合成窗口 */        static DIA_COMPOSE = "ComposeDialog";
        /**打飞机商城 */        static DIA_FLYSHOP = "FlyShopDlg";
        /**打飞机鱼鉴 */        static DIA_FLYFISHMAP = "FlyFishMapDlg";
        /**打飞机潜艇购买 */        static DIA_FLYBOATSBUY = "FlyBoatsBuyDlg";
        /**超值礼包窗口 */        static DIA_CHAOZHI = "GiftCzDlg";
        static DIA_FLYSP = "diaFlysp";
        static DIA_SURE = "ExchangeSureDlg";
        static DIA_FREEALL = "FreeAllDlg";
        static DIA_RECORE = "ExChangeRecordDlg";
        static DIA_COMMON = "ExChangeRecordDlg";
        /**物品月卡ID */        static ItemMonthCardID = "100";
        /**金币ID */        static GoldCoinID = "1";
        /**钻石ID */        static DiamondID = "2";
        /**奖券ID */        static TicketID = "4";
        /**碎片ID */        static DebrisID = "41";
        /**积分ID */        static PointID = "42";
        /**金色字体 */        static GoldText = "gold";
        /**白色字体 */        static WhiteText = "white";
        /**白色字体 */        static BlueText = "blue";
        /**白色字体 */        static RedText = "red";
        /**背包道具购买 */        static ItemBuy = "itemBuy";
        /**背包道具赠送 */        static ItemGive = "itemGive";
        /**背包月卡购买 */        static ItemMonthbuy = "itemMonthBuy";
        /**背包碎片合成 */        static ItemCompose = "itemCompose";
        /**月卡类型 */        static MonthCardType = "monthcard";
        /**金币类型 */        static GoldCoinType = "gold_shop";
        /**钻石类型 */        static DiamondType = "zuan_shop";
        //金币，钻石类型itemKey
        static goldKey = "1";
        static diamondKey = "2";
        /**物品飞行终点索引值-大厅背包 */        static itemFlyPackage = 0;
        /**物品飞行终点索引值-大厅金币 */        static itemFlyHallCoin = 1;
        /**物品飞行终点索引值-大厅奖券 */        static itemFlyHallTicket = 2;
        /**物品飞行终点索引值-房间炮座 */        static itemFlyCannon = 3;
        /**物品飞行终点索引值-房间金币 */        static itemFlyRoomCoin = 4;
        /**物品飞行终点索引值-房间奖券 */        static itemFlyRoomTicket = 5;
        /**物品飞行终点索引值-房间龙炮 */        static itemFlyRoomDragonCannon = 6;
        /**物品飞行终点索引值-打飞机场金币 */        static itemFlyFlyGold = 100;
        /**物品飞行终点索引值-打飞机场奖券 */        static itemFlyFlyTicket = 101;
        //特色鱼Id
        /**钻头蟹 */        static zuanTouId = 240;
        /**鸿运当头 */        static HongYunId = 250;
        /**海王宝藏 */        static hwbzId = 260;
        /**珠事好运 */        static zshyId = 270;
        /**幸运转盘 */        static xyzpId = 280;
        /**五龙寻宝 */        static wlxbId = 290;
        static enterRoomFlag = true;
        // public static isNeedGuide: boolean = false;
        static isFirstOpenSc = false;
        static isFirstOpenTh = true;
        static isFirstOpenNewTh = true;
        /**渔场内最多弹窗弹出次数 */        static dlgPopMax = 0;
        /**打飞机场的roomtype */        static flyRoomType = "50";
        static vipWarType = 20;
}