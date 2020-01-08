export default class GlobalVar{
    /**
     * 微信code是否过期
     */
    static wxcode_overdue = false;
    //-------------------------------------event cmds
    static PLAY_SOUND_RAWARD = "playSoundRaward";
    //播放获得奖励
    /**传递spine */            
    static SPINE_SEND = "spineSend";
    /**导弹发射 */            
    static BOMB_FIRE = "bombFire";
    /**房间内装备切换 */            
    static ROOM_SKIN_CHANGE = "roomSkinChange";
    static ROOM_SKIN_CHANGE_BROAD = "roomSkinChangeBraod";
    /**重新播放背景音乐 */            
    static REPLAY_MUSIC = "replayMusic";
    /**关闭首充红点 */            
    static CLOSE_FIRSTPACKAGE_DIAN = "CloseFirstPackageDian";
    /**通知渔场玩家为新手 */            
    static NEW_PLAYER = "NewPlayer";
    /**成功获取公告信息 */            
    static GET_NOTICE_SUCCESS = "getNoticeSuccess";
    /**获取免费礼包信息完成 */            
    static GET_FREE_GIFT_INFO_SUCCESS = "getFreeGiftInfoSuccess";
    /**玩家信息通知 */            
    static PLATER_INFO_NOTICE = "PlayerInfoNotice";
    /**物品购买量 */            
    static ITEM_BUY_NUM = "itemBuyNum";
    /**播放房间内托盘动画 */            
    static PLAY_ROOM_TRAY_ANI = "playRoomTrayAni";
    /**房间内特色鱼结束 */            
    static ROOM_SPECIAL_FISH_END = "roomSpecialFishEnd";
    /**房间内特色鱼自动结束 */            
    static ROOM_SPECIAL_FISH_AUTO_END = "roomSpecialFishAutoEnd";
    /**鸿运当头分值更新 */            
    static HONG_YUN_SCORE_UPDATE = "hongYunScoreUpdate";
    /**龙座上升 */            
    static DRAGON_BALL_BACK = "dragonBallBack";
    /**五龙珠计分板弹出 */            
    static DRAGON_SCORE_BOARD_POP = "dragonScoreBoardPop";
    /**珠事好运贝壳实例关闭鼠标点击事件 */            
    static PEARL_MOUSE_ENABLED = "pearlUnEnabled";
    /**珠事好运鼠标点击事件 */            
    static PEARL_MOUSE_DOWN = "pearlMouseDown";
    /**珠事好运初始动画播放结束事件 */            
    static PEARL_ANI_COMPLETE = "pearlAniComplete";
    /**珠事好运打开动画播放结束事件 */            
    static PEARL_OPEN_ANI_COMPLETE = "pearlOpenAniComplete";
    /**珠事好运弹出动画播放结束事件 */            
    static PEARL_ANI_POP_COMPLETE = "pearlAniPopComplete";
    /**海王宝藏开始游戏 */            
    static HWBZ_START_GAME = "hwbzStartGame";
    /**海王宝藏点击事件 */            
    static HWBZ_CLICK_EVENT = "hwbzClickEvent";
    /**自己切换炮倍奖池提示 */            
    static JACKPOT_CHANGE_PAO = "jackpotChangePao";
    /**通知玩家昨天击落金币 */            
    static NOTICE_YESTERDAY_GOLD = "noticeYesterDayGold";
    /**通知玩家昨天击落金币 */            
    static NOTICE_YESTERDAY_DONE = "noticeYesterDayDone";
    /**记录去过的最高登记房间 */            
    static GET_ROOM_MAX = "getRoomMax";
    /**切换辅助面板状态 */            
    static CHANGE_ROOM_HELP_STATE = "changeRoomHelpState";
    /**活动界面删除活动标签 */            
    static DELETE_ACTIVITY_TAB = "deleteActivityTab";
    static ITEM_BUY = "buyItem";
    //购买物品
    static ITEM_ZENG_SONG = "zengSong";
    //道具赠送
    static UPDATE_PLAYER_DATA = "upDatePlayerData";
    //更新玩家信息
    static GATE_LOGIN_SUC_NOTICE = "GATE_LOGIN_SUC_NOTICE";
    //玩家登录网关成功
    static ITEM_INFO_INIT = "ITEM_INFO_INIT";
    //商品信息初始化
    static CONFIG_INFO_NOTICE = "config_info_notice";
    //商品配置开关信息初始化
    static COMMODITY_BUY = "CommodityBuy";
    //商品购买
    static NEWUSERPACK_BUY = "newbie";
    //新手礼包购买
    static LIMITTIMEPACK_BUY = "limitPack";
    //限时礼包购买
    static INVITEDATAREFRESH = "inviteDataFresh";
    //邀请好友信息更新
    static ITEM_ZENG_SONG_NOTICE = "zengSongResp";
    //道具赠送
    static ITEM_BUY_NOTICE = "buyItemResp";
    //购买物品
    static COMMODITY_PAY_OK = "PayOK";
    //商品购买成功
    static COMMODITY_PAY_FALSE = "PayOK";
    //商品购买失败
    static DATA_VIP_INFO = "VipInfo";
    //vip信息升级
    static VIP_EXP_UP = "vipExpUp";
    //vip经验提升
    static VIP_UP = "VipUp";
    //vip升级
    static REWARD_OPEN = "RewardOpen";
    //打开奖励界面
    static UPDATA_MAIL_NUM = "updataMailnum";
    //更新大厅邮件数量
    static MY_RES = "MyRes";
    //玩家货币信息
    static ADD_NOTICE_TO_LIST = "LEDMsg";
    //添加通告至列表
    static BASE_TASK_INFO = "baseTaskinfo";
    //基础活动信息
    static TASK_SCHEDULE = "taskschedule";
    //任务进度
    static UPDATE_TASK = "updatetask";
    //任务进度更新
    static LIMITTIMEPACK_END = "limitTimeOver";
    //限时礼包结束
    static WX_ONSHOW = "wxOnshow";
    //wxonshow事件
    static WX_ONHIDE = "wxOnhide";
    //wxonhide事件
    static ROOM_USER_LOGIN = "QuickEnter";
    //玩家登录网关
    static ROOM_FISHLINE = "FishLine";
    //活着的鱼线信息
    static ROOM_LEAVEROOM = "LeaveRoom";
    //离开房间
    static RUN_CALL_BACK = "RunCallBack";
    //音效执行回调
    static ROOM_SHOOT = "Shoot";
    //子弹发射
    static ROOM_HIT = "Hit";
    //碰撞命中
    static ROOM_UPGRADE_PAO = "UpgradePao";
    //炮倍升级
    static ROOM_UPGRADE_ALL = "UpgradePaoAttach";
    //一键解锁炮倍
    static ROOM_ALTER_PAO = "AlterPao";
    //炮倍切换
    static ROOM_LOCK_SHOOT = "LockAim";
    //锁定子弹发射
    static ROOM_RAGE_SHOOT = "Rage";
    //狂暴子弹发射
    static ROOM_FREEZE_SHOOT = "Freeze";
    //冰冻
    static LOTTERY_DRAW = "Lottery";
    //抽奖
    static LOTTERY_CLEAR_INTEGRAL = "clearPlayerIntegral";
    //清理玩家赏金池
    static ROOM_FREEZE_STOP = "FreezeOver";
    //停止冰冻
    static ROOM_IS_GET_RELIVE = "isGetRelive";
    //是否获取救济金
    static ROOM_SPECIAL_BOOM_FISH = "FishBomb";
    //炸弹鱼爆炸
    static REFRESH_BOSS = "RefreshBoss";
    //boss重生
    static ROOM_SPECIAL_ZUANTOU_FISH = "ZuantouBomb";
    //钻头鱼爆炸
    static ROOM_WATCH_VIDEO = "WatchVideo";
    //房间看视频
    static HUA_FEI_TI_SHI = "huafeiTishi";
    //话费引导提示
    static LOGIN_ROULETTE_REWARD = "LoginRouletteReward";
    //登陆转盘奖励
    static HALL_DEBRISE_COMPOSE = "hallDebriseCompose";
    //大厅碎片合成
    static GIFT_CHAOZ1_GET = "hallDebriseCompose";
    //特惠礼包购买到账_1
    static GIFT_CHAOZ2_GET = "hallDebriseCompose";
    //特惠礼包购买到账_2
    static UPDATE_ACTIVITY_RED = "update_activity_red";
    //更新活动红点状态
    static DELETE_SHORT_MESSAGE = "DELETE_SHORT_MESSAGE";
    //删除上一个短提示
    //--------------------------room
    static LEAVE_ROOM_SUCCESS = "leave_room_success";
    static ENTER_ROOM_SUCCESS = "enter_room_success";
    //进房间成功
    static ENTER_ROOM_FAIL = "enter_room_fail";
    //进房间失败
    static NET_OVER = "net_over";
    //网络断开
    static NET_ON = "net_on";
    //网络断开结束
    static ROOM_FISHRESOK_NOTICE = "ROOM_FISHRESOK_NOTICE";
    //鱼资源加载完成
    static ROOM_LOCK_SHOOT_NOTICE = "ROOM_LOCK_SHOOT_NOTICE";
    //锁定子弹发射
    static ROOM_RAGE_SHOOT_NOTICE = "ROOM_RAGE_SHOOT_NOTICE";
    //狂暴子弹发射
    static ROOM_FREEZE_SHOOT_NOTICE = "ROOM_FREEZE_SHOOT_NOTICE";
    //冰冻
    static ROOM_FREEZE_STOP_NOTICE = "ROOM_FREEZE_STOP_NOTICE";
    //停止冰冻
    static ROOM_LOCK_STOP_NOTICE = "ROOM_LOCK_STOP_NOTICE";
    //停止锁定
    static ROOM_RAGE_STOP_NOTICE = "ROOM_RAGE_STOP_NOTICE";
    //停止狂暴
    static DAO_DAN_BOMB = "Bomb";
    //发射导弹
    static BIT_BOOM = "bitBoom";
    //钻头鱼爆炸
    static ADDRESS_SET_SUCCESS = "addressSetSuccess";
    //管理地址成功
    static REQ_ADDRESS_SUCCESS = "reqAddressSuccess";
    //请求地址信息成功
    static COUNT_VIEW_CHANGE = "countViewChange";
    //countView点击
    static REFRESH_SKILL_LIST = "refreshSkillList";
    //技能计时
    static ROOM_USE_ITEM_NOTICE = "roomUseItemNotice";
    //房间内使用道具通知
    static ROOM_USE_DAO_DAN_NOTICE = "roomUseDaoDanNotice";
    //房间内使用道具通知
    static ROOM_CHANGE_DRAGON_CANNON_START = "roomChangeDragonCannonStart";
    //龙炮开启通知
    static ROOM_CHANGE_DRAGON_CANNON_END = "roomChangeDragonCannonEnd";
    //龙炮关闭通知
    static CLOSE_FISH_SCENE_VIEW = "closeFishSceneView";
    //关闭房间内面板
    static REFRESH_COMPOSE = "refreshCompose";
    //属性合成后信息
    static HY_CHANGE = "hyChange";
    //鸿运当头状态变化
    static LAST_BULLET_VIEW_OPEN = "lastBulletViewOpen";
    //剩余子弹面板开启
    static HEART_BEAT = "heartBeat";
    //游戏心跳
    static GET_HALL_COIN_POS = "getHallCoinPos";
    //获取大厅金币位置坐标
    static SEND_HALL_COIN_POS = "sendHallCoinPos";
    //发送大厅金币位置坐标
    static UPDATE_ITEMS_NUM_FROM_PLAYERDATA = "update_items_num_from_playerData";
    //更新玩家资源信息从playerData获取
    static TOMORROW_GOT = "tomorrowGot";
    //明日奖励领取
    static TOMORROW_SEND = "tomorrowSend";
    //明日奖励激活
    static GETMONTHREWARD = "getMonthReward";
    //月卡奖励
    static CHANGE_AUTO_PAO_STATE = "change_autoPao_state";
    //切换自动开炮状态
    static YAO_YI_YAO = "yaoyiyao";
    static CLOSE_MYSEAT_ANI = "CloseMySeatAni";
    //关闭我的座位动画
    static MARQUEE_BROAD_MSG = "MarqueeBroadMsg";
    //跑马灯广播
    static YAO_CHANGE = "yaoChange";
    //摇一摇变化
    static SHARE_ADD = "shareAdd";
    //邀请人数增加
    static SHARE_REWARD = "shareReward";
    //邀请领奖
    static CHANGEDAY = "changeDay";
    //跨天
    static SHOW_TICKET_TIPS = "show_ticket_tips";
    //显示奖券兑换话费提示
    // --------------------------------------------------------
    static isMe = true;
    //不播放声音
    static disableSound = false;
    static showLog = true;
    static isOutVersion = false;
    //是否是对外版本，去掉显示的测试信息
    static zipDownVer = false;
    //是否分包下载
    static phoneBrand = "";
    //手机型号
    static phoneSystem = "";
    //手机操作系统
    static channelId = "";
    static hasGetNotice = false;
    static isWxGranted = undefined;
    //微信是否已授权
    static ITEM_GOLD = "1";
    //金币
    static ITEM_DMD = "2";
    //钻石
    static soundType = ".mp3";
    //设置.mp3格式或者.ogg格式
    static isOpenTeamLog = false;
    static isDevelopMode = false;
    //开发模式
    static isTestBtnOpen = false;
    //开启测试按钮,模拟器屏蔽下载
    static isShenHeVer = false;
    //
    //只要有包1，就不是新用户
    static isNewUserWx = false;
    //是否是新用户：删包也算新用户
    static lastAldTime = 0;
    // 最后打点时间
    static lastAldTimeNew = 0;
    // 新用户最后打点时间
    static lastZip1 = 0;
    //zip1,2最后打点时间
    static lastZip2 = 0;
    static aldStr = "";
    static isNewZipUser = false;
    //是否走全流程，下载zip1-zip2-进入游戏
    static needSh = false;
    static fswx: any;
    static reUrl: string;
    static runStage: string;
    static unZipPath: any;
    static updateOver: boolean;
    static remotePre: string;
}