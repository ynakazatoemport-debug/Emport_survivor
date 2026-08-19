const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const topBar = document.getElementById('top-bar');
const poisonStatusIcon = document.getElementById('poison-status-icon');
const atkDownStatusIcon = document.getElementById('atk-down-status-icon');
const stunStatusIcon = document.getElementById('stun-status-icon');
const hpBarContainer = document.getElementById('hp-bar-container');
const hpBarFill = document.getElementById('hp-bar-fill');
const hpText = document.getElementById('hp-text');
const expBarContainer = document.getElementById('exp-bar-container');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const expBarFill = document.getElementById('exp-bar-fill');

const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const gameoverTitleBtn = document.getElementById('gameover-title-btn');

const levelUpScreen = document.getElementById('level-up-screen');
const skillOptionsContainer = document.getElementById('skill-options');
const pauseScreen = document.getElementById('pause-screen');
const resumeBtn = document.getElementById('resume-btn');
const titleBtn = document.getElementById('title-btn');

const waveDisplay = document.getElementById('wave-display');
const timeDisplay = document.getElementById('time-display');

const gameClearScreen = document.getElementById('game-clear');
const clearScoreDisplay = document.getElementById('clear-score');
const clearRestartBtn = document.getElementById('clear-restart-btn');
const clearTitleBtn = document.getElementById('clear-title-btn');

const startScreen = document.getElementById('start-screen');
const stageButtons = document.querySelectorAll('.stage-btn');

// モバイル操作用要素
const mobileControls = document.getElementById('mobile-controls');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const joystickMoveContainer = document.getElementById('joystick-move-container');
const joystickMoveBase = document.getElementById('joystick-move-base');
const joystickMoveStick = document.getElementById('joystick-move-stick');
const joystickAttackContainer = document.getElementById('joystick-attack-container');
const joystickAttackBase = document.getElementById('joystick-attack-base');
const joystickAttackStick = document.getElementById('joystick-attack-stick');
const orientationWarning = document.getElementById('orientation-warning');

// 自機画像の事前プリロード（方向変更やステージ開始時のチラつき・未ロードを防ぐ）
let selectedCharacter = '男性';
const playerImages = {
    '通常_男性_前': new Image(),
    '通常_男性_後ろ': new Image(),
    '通常_男性_左': new Image(),
    '通常_男性_右': new Image(),
    '通常_女性_前': new Image(),
    '通常_女性_後ろ': new Image(),
    '通常_女性_左': new Image(),
    '通常_女性_右': new Image(),
    '農業_男性_前': new Image(),
    '農業_男性_後ろ': new Image(),
    '農業_男性_左': new Image(),
    '農業_男性_右': new Image(),
    '農業_女性_前': new Image(),
    '農業_女性_後ろ': new Image(),
    '農業_女性_左': new Image(),
    '農業_女性_右': new Image()
};

playerImages['通常_男性_前'].src = 'キャラ/自機/立ち絵/男性＿前.png';
playerImages['通常_男性_後ろ'].src = 'キャラ/自機/立ち絵/男性＿後ろ.png';
playerImages['通常_男性_左'].src = 'キャラ/自機/立ち絵/男性＿左.png';
playerImages['通常_男性_右'].src = 'キャラ/自機/立ち絵/男性＿右.png';

playerImages['通常_女性_前'].src = 'キャラ/自機/立ち絵/女性＿前.png';
playerImages['通常_女性_後ろ'].src = 'キャラ/自機/立ち絵/女性＿後ろ.png';
playerImages['通常_女性_左'].src = 'キャラ/自機/立ち絵/女性＿左.png';
playerImages['通常_女性_右'].src = 'キャラ/自機/立ち絵/女性＿右.png';

playerImages['農業_男性_前'].src = 'キャラ/自機/立ち絵/農業_男性＿前.png';
playerImages['農業_男性_後ろ'].src = 'キャラ/自機/立ち絵/農業_男性＿後ろ.png';
playerImages['農業_男性_左'].src = 'キャラ/自機/立ち絵/農業_男性＿左.png';
playerImages['農業_男性_右'].src = 'キャラ/自機/立ち絵/農業_男性＿右.png';

playerImages['農業_女性_前'].src = 'キャラ/自機/立ち絵/農業_女性＿前.png';
playerImages['農業_女性_後ろ'].src = 'キャラ/自機/立ち絵/農業_女性＿後ろ.png';
playerImages['農業_女性_左'].src = 'キャラ/自機/立ち絵/農業_女性＿左.png';
playerImages['農業_女性_右'].src = 'キャラ/自機/立ち絵/農業_女性＿右.png';

function getCurrentPlayerImg(stage = selectedStageName, char = selectedCharacter, dir = '前') {
    const stagePrefix = (stage === '農業部門') ? '農業' : '通常';
    const key = `${stagePrefix}_${char}_${dir}`;
    const img = playerImages[key];
    if (img && img.complete && img.naturalWidth !== 0) {
        return img;
    }
    // 該当方向がロード中でない場合は「前」向きをフォールバック
    const fallbackKey = `${stagePrefix}_${char}_前`;
    const fallbackImg = playerImages[fallbackKey];
    if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth !== 0) {
        return fallbackImg;
    }
    // 通常男性前
    return playerImages['通常_男性_前'];
}

// 互換用エイリアス
const playerImg = playerImages['通常_男性_前'];

// ボス画像の読み込み
const bossImg = new Image();
bossImg.src = 'キャラ/敵/character_monster_ghost_white.png';

// 背景画像の読み込み
const bgImg = new Image();
bgImg.src = '背景/temple-3d1.jpg';

const pcBgImg = new Image();
pcBgImg.src = '背景/PC背景.png';

const kitchenBgImg = new Image();
kitchenBgImg.src = '背景/キッチン背景.png';

const cleaningBgImg = new Image();
cleaningBgImg.src = '背景/清掃背景.png';

const agricultureBgImg = new Image();
agricultureBgImg.src = '背景/農業背景.png';

const pcEnemiesImg = new Image();
pcEnemiesImg.src = 'キャラ/敵/PC部門敵.png';

const kitchenEnemiesImgs = [];
['11.png', '12.png', '13.png', '14.png', '15.png', '16.png'].forEach(filename => {
    const img = new Image();
    img.src = `キャラ/敵/キッチン部門敵/${filename}`;
    kitchenEnemiesImgs.push(img);
});

const cleaningEnemiesImgs = [];
['17.png', '18.png', '19.png', '20.png', '21.png'].forEach(filename => {
    const img = new Image();
    img.src = `キャラ/敵/清掃部門敵/${filename}`;
    cleaningEnemiesImgs.push(img);
});

const agricultureEnemiesImgs = [];
['22.png', '23.png', '24.png', '25.png', '26.png'].forEach(filename => {
    const img = new Image();
    img.src = `キャラ/敵/農業部門敵/${filename}`;
    agricultureEnemiesImgs.push(img);
});

// 鳩画像の読み込み
const doveSpriteImg = new Image();
doveSpriteImg.src = 'キャラ/武器/鳩.png';

// PC部門の武器（文字）画像の読み込み
const pcBulletImg = new Image();
pcBulletImg.src = 'キャラ/武器/PC_弾.png';

const pcWeaponLetters = [
    {x: 155, y: 139, w: 91, h: 165},
    {x: 255, y: 139, w: 91, h: 165},
    {x: 355, y: 139, w: 91, h: 165},
    {x: 455, y: 139, w: 91, h: 165},
    {x: 555, y: 139, w: 91, h: 165},
    {x: 655, y: 139, w: 91, h: 165},
    {x: 755, y: 139, w: 91, h: 165},
    {x: 55, y: 419, w: 91, h: 165},
    {x: 192, y: 419, w: 17, h: 165},
    {x: 255, y: 419, w: 91, h: 165},
    {x: 355, y: 419, w: 91, h: 165},
    {x: 455, y: 419, w: 91, h: 165},
    {x: 555, y: 419, w: 91, h: 165},
    {x: 655, y: 419, w: 91, h: 165},
    {x: 755, y: 419, w: 91, h: 165},
    {x: 855, y: 419, w: 91, h: 165},
    {x: 5, y: 698, w: 91, h: 177},
    {x: 105, y: 698, w: 91, h: 177},
    {x: 205, y: 698, w: 91, h: 177},
    {x: 305, y: 698, w: 91, h: 177},
    {x: 405, y: 698, w: 91, h: 177},
    {x: 505, y: 698, w: 91, h: 177},
    {x: 605, y: 698, w: 91, h: 177},
    {x: 705, y: 698, w: 91, h: 177},
    {x: 805, y: 698, w: 91, h: 177},
    {x: 905, y: 698, w: 91, h: 177}
];

// 包丁画像の読み込み
const knifeImg = new Image();
knifeImg.src = 'キャラ/武器/包丁.png';

// 攻撃力低下時の包丁画像の読み込み（刃こぼれ）
const knifeDebuffImg = new Image();
knifeDebuffImg.src = 'キャラ/武器/包丁＿攻撃力低下.png';

// ナイフ画像の読み込み
const knifeWeaponImg = new Image();
knifeWeaponImg.src = 'キャラ/武器/ナイフ.png';

// モップ画像の読み込み
const mopImg = new Image();
mopImg.src = 'キャラ/武器/キッチン武器/モップ.png';

// 農業武器（スプラッシュ）画像の読み込み
const agriWeaponImg = new Image();
agriWeaponImg.src = 'キャラ/武器/農業.png';

// 清掃武器（水流）画像の読み込み
const cleaningWeaponImg = new Image();
cleaningWeaponImg.src = 'キャラ/武器/清掃.png';

// 岩画像の読み込み
const rockImg = new Image();
rockImg.src = '背景/岩.png';

// 木箱画像の読み込み
const boxImg = new Image();
boxImg.src = '背景/木箱.png';

// 段ボール画像の読み込み
const cardboardImg = new Image();
cardboardImg.src = '背景/空き段ボール.png';

// ゴミ箱画像の読み込み
const trashcanImg = new Image();
trashcanImg.src = '背景/ゴミ箱.png';

// キッチン部門用段ボール画像の読み込み
const kitchenCardboardImg = new Image();
kitchenCardboardImg.src = '背景/キッチン段ボール.png';

// 毒デバフ画像の読み込み
const poisonMoyaImg = new Image();
poisonMoyaImg.src = 'キャラ/デバフ/毒＿もや.png';

// スタンデバフ画像の読み込み
const stunEffectImg = new Image();
stunEffectImg.src = 'キャラ/デバフ/スタン＿エフェクト.png';

// 攻撃力低下デバフ画像の読み込み
const atkDownEffectImg = new Image();
atkDownEffectImg.src = 'キャラ/デバフ/ATK＿DOWN.png';

// ゲーム状態
let score = 0;
let level = 1;
let exp = 0;
let nextLevelExp = 10;
let currentWave = 1;
const maxWaves = 20;
let selectedStageName = "PC部門";
let waveTimer = 15000; // 15秒
const waveDuration = 15000;

let isGameStarted = false; // ゲームプレイ中かどうかのフラグ
let isGameOver = false;
let isGameClear = false;
let isPaused = false;
let isLevelUpPaused = false;
let bossActive = false; // ボス戦中かどうかのフラグ
let animationId;
let lastTime = 0;

// 画面・ワールドサイズ定数
const WORLD_WIDTH = 3840;
const WORLD_HEIGHT = 2160;

// ビューポートサイズ（PC初期値は1920x1080、モバイル縦画面時は動的調整）
let viewWidth = 1920;
let viewHeight = 1080;

// カメラ（ワールド座標系でのビュー左上点）
const camera = { x: 0, y: 0 };

// PCかモバイル（スマートフォン・タブレット）かの厳密な判定関数
function detectMobileDevice() {
    // 1. ユーザーエージェント判定
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);

    // 2. iPadOS（Safariデスクトップモード）判定
    const isIPad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // 3. タッチ・ポインタ判定（マウス主体のPCとタッチ端末を明確に区別）
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const isNoHover = window.matchMedia && window.matchMedia('(hover: none)').matches;

    // モバイル端末判定: モバイルUA または iPad または (タッチ対応かつ粗いポインタ/ホバー不可)
    return isMobileUA || isIPad || (hasTouch && (isCoarsePointer || isNoHover));
}

let isTouchDevice = detectMobileDevice();
let isMobileMode = isTouchDevice;

function checkMobileMode() {
    // ① まずPCかモバイルかを厳密に判定
    isTouchDevice = detectMobileDevice();
    isMobileMode = isTouchDevice;

    if (isMobileMode) {
        document.body.classList.add('mobile-mode');
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.remove('mobile-mode');
        document.body.classList.remove('touch-device');
    }

    // ② PCの場合
    // → 縦横判定を行わない
    // → 「端末を縦向きにしてください」を絶対に表示しない
    // → PC版ゲームを通常通り表示
    if (!isMobileMode) {
        if (orientationWarning) {
            orientationWarning.classList.add('hidden');
        }
        if (mobileControls) mobileControls.classList.add('hidden');
        if (mobileMenuBtn) mobileMenuBtn.classList.add('hidden');
        return;
    }

    // ③ スマートフォン・タブレットの場合のみ、縦横判定（Portrait / Landscape）を行う
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const isPortrait = windowH >= windowW;

    if (orientationWarning) {
        if (!isPortrait) {
            // ⑤ スマートフォン・タブレットが横画面 → 警告を表示
            orientationWarning.classList.remove('hidden');
        } else {
            // ④ スマートフォン・タブレットが縦画面 → 警告を非表示
            orientationWarning.classList.add('hidden');
        }
    }

    // ゲーム中のモバイルUI表示状態の同期（縦画面時のみ表示）
    if (isGameStarted && !isGameOver && !isGameClear && !isPaused && !isLevelUpPaused) {
        if (isPortrait) {
            if (mobileControls) mobileControls.classList.remove('hidden');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('hidden');
        } else {
            if (mobileControls) mobileControls.classList.add('hidden');
            if (mobileMenuBtn) mobileMenuBtn.classList.add('hidden');
        }
    }
}

// 画面解像度とカメラ視野の動的リサイズ
function resizeCanvas() {
    checkMobileMode();

    if (isMobileMode) {
        // スマートフォン・タブレット縦画面: 端末の縦横比に応じた動的ビューポート
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        const aspect = windowH / Math.max(1, windowW);
        viewWidth = 1080;
        viewHeight = Math.round(viewWidth * aspect);
    } else {
        // PC（ウィンドウサイズ、ズーム倍率、縦長ウィンドウ等に関わらず常に1920x1080のPC仕様）
        viewWidth = 1920;
        viewHeight = 1080;
    }

    canvas.width = viewWidth;
    canvas.height = viewHeight;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
});
resizeCanvas();

// 入力状態（PCキーボード・マウス）
const keys = { w: false, a: false, s: false, d: false };
const mouse = { x: viewWidth / 2, y: viewHeight / 2 };

// モバイルバーチャルスティック入力状態
const mobileInput = {
    move: { x: 0, y: 0, active: false },
    attack: { x: 0, y: 0, active: false, angle: 0, hasAngle: false }
};

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isGameStarted && !isGameOver && !isGameClear && !isLevelUpPaused) {
            togglePause();
        }
        return;
    }
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
});

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        mouse.x = (e.clientX - rect.left) * (viewWidth / rect.width);
        mouse.y = (e.clientY - rect.top) * (viewHeight / rect.height);
    }
});

// バーチャルスティックのマルチタッチ・ポインター制御
let movePointerId = null;
let attackPointerId = null;
const MAX_STICK_DIST = 40; // スティック最大可動半径(px)

function updateStickVisual(stickEl, dx, dy) {
    if (stickEl) {
        stickEl.style.transform = `translate(${dx}px, ${dy}px)`;
    }
}

function processMovePointer(clientX, clientY, centerX, centerY) {
    const rawDx = clientX - centerX;
    const rawDy = clientY - centerY;
    const dist = Math.hypot(rawDx, rawDy);
    const clampedDist = Math.min(dist, MAX_STICK_DIST);
    const angle = Math.atan2(rawDy, rawDx);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;
    updateStickVisual(joystickMoveStick, stickX, stickY);

    const normDist = clampedDist / MAX_STICK_DIST;
    if (normDist > 0.15) {
        mobileInput.move.x = Math.cos(angle) * normDist;
        mobileInput.move.y = Math.sin(angle) * normDist;
        mobileInput.move.active = true;
    } else {
        mobileInput.move.x = 0;
        mobileInput.move.y = 0;
        mobileInput.move.active = false;
    }
}

function processAttackPointer(clientX, clientY, centerX, centerY) {
    const rawDx = clientX - centerX;
    const rawDy = clientY - centerY;
    const dist = Math.hypot(rawDx, rawDy);
    const clampedDist = Math.min(dist, MAX_STICK_DIST);
    const angle = Math.atan2(rawDy, rawDx);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;
    updateStickVisual(joystickAttackStick, stickX, stickY);

    if (dist > 6) {
        mobileInput.attack.angle = angle;
        mobileInput.attack.active = true;
        mobileInput.attack.hasAngle = true;
    }
}

// Pointer Events によるマルチタッチ＆マウス操作
if (joystickMoveContainer) {
    joystickMoveContainer.addEventListener('pointerdown', (e) => {
        if (movePointerId === null) {
            movePointerId = e.pointerId;
            joystickMoveContainer.setPointerCapture(e.pointerId);
            const moveRect = joystickMoveBase.getBoundingClientRect();
            processMovePointer(e.clientX, e.clientY, moveRect.left + moveRect.width / 2, moveRect.top + moveRect.height / 2);
        }
    });

    joystickMoveContainer.addEventListener('pointermove', (e) => {
        if (e.pointerId === movePointerId) {
            const moveRect = joystickMoveBase.getBoundingClientRect();
            processMovePointer(e.clientX, e.clientY, moveRect.left + moveRect.width / 2, moveRect.top + moveRect.height / 2);
        }
    });

    const resetMove = (e) => {
        if (e.pointerId === movePointerId) {
            movePointerId = null;
            mobileInput.move.x = 0;
            mobileInput.move.y = 0;
            mobileInput.move.active = false;
            updateStickVisual(joystickMoveStick, 0, 0);
        }
    };
    joystickMoveContainer.addEventListener('pointerup', resetMove);
    joystickMoveContainer.addEventListener('pointercancel', resetMove);
}

if (joystickAttackContainer) {
    joystickAttackContainer.addEventListener('pointerdown', (e) => {
        if (attackPointerId === null) {
            attackPointerId = e.pointerId;
            joystickAttackContainer.setPointerCapture(e.pointerId);
            const attackRect = joystickAttackBase.getBoundingClientRect();
            processAttackPointer(e.clientX, e.clientY, attackRect.left + attackRect.width / 2, attackRect.top + attackRect.height / 2);
        }
    });

    joystickAttackContainer.addEventListener('pointermove', (e) => {
        if (e.pointerId === attackPointerId) {
            const attackRect = joystickAttackBase.getBoundingClientRect();
            processAttackPointer(e.clientX, e.clientY, attackRect.left + attackRect.width / 2, attackRect.top + attackRect.height / 2);
        }
    });

    const resetAttack = (e) => {
        if (e.pointerId === attackPointerId) {
            attackPointerId = null;
            mobileInput.attack.active = false;
            updateStickVisual(joystickAttackStick, 0, 0);
        }
    };
    joystickAttackContainer.addEventListener('pointerup', resetAttack);
    joystickAttackContainer.addEventListener('pointercancel', resetAttack);
}

// 攻撃角度取得ヘルパー関数（PCのマウス座標とモバイルのATTACKスティック角度を統一）
function getPlayerAttackAngle(playerObj) {
    if (isMobileMode && mobileInput.attack.hasAngle) {
        return mobileInput.attack.angle;
    }
    return Math.atan2((mouse.y + camera.y) - playerObj.y, (mouse.x + camera.x) - playerObj.x);
}





// スキルの定義
const weaponDefinitions = [
    {
        id: 'magicWand',
        title: '魔法の杖',
        type: 'weapon',
        desc: '最も近い敵に向かって魔法弾を撃ちます。',
        upgrades: [
            '威力アップ、クールダウン短縮',
            '威力アップ、発射数+1、クールダウン短縮',
            '威力アップ、クールダウン短縮',
            '威力アップ、発射数+1、クールダウン短縮',
            '威力アップ、クールダウン短縮',
            '威力アップ、発射数+1、クールダウン短縮'
        ],
        create: () => new MagicWand()
    },
    {
        id: 'garlic',
        title: 'ニンニク',
        type: 'weapon',
        desc: '周囲の敵に継続してダメージを与えます。',
        upgrades: [
            '威力アップ、範囲拡大',
            '威力アップ、範囲拡大',
            '威力アップ、範囲拡大',
            '威力アップ、範囲拡大',
            '威力アップ、範囲拡大',
            '威力アップ、範囲拡大'
        ],
        create: () => new Garlic()
    },
    {
        id: 'knife',
        title: 'ナイフ',
        type: 'weapon',
        desc: '向いている方向にナイフを投げます。',
        upgrades: [
            '威力アップ、クールダウン短縮',
            '威力アップ、発射数+1、クールダウン短縮',
            '威力アップ、クールダウン短縮',
            '威力アップ、発射数+1、クールダウン短縮',
            '威力アップ、クールダウン短縮',
            '威力アップ、発射数+1、クールダウン短縮'
        ],
        create: () => new Knife()
    },
    {
        id: 'holyWater',
        title: '聖水',
        type: 'weapon',
        desc: 'ランダムな位置にダメージエリアを生成します。',
        upgrades: [
            '威力アップ、クールダウン短縮',
            '威力アップ、生成数+1、クールダウン短縮',
            '威力アップ、クールダウン短縮',
            '威力アップ、生成数+1、クールダウン短縮',
            '威力アップ、クールダウン短縮',
            '威力アップ、生成数+1、クールダウン短縮'
        ],
        create: () => new HolyWaterWeapon()
    },
    {
        id: 'lightningRing',
        title: '雷の指輪',
        type: 'weapon',
        desc: 'ランダムな敵に雷を落とし範囲ダメージを与えます。',
        upgrades: [
            '威力アップ、クールダウン短縮',
            '威力アップ、落雷数+1、クールダウン短縮',
            '威力アップ、クールダウン短縮',
            '威力アップ、落雷数+1、クールダウン短縮',
            '威力アップ、クールダウン短縮',
            '威力アップ、落雷数+1、クールダウン短縮'
        ],
        create: () => new LightningRing()
    },
    {
        id: 'whiteDove',
        title: '純白の鳩',
        type: 'weapon',
        desc: '時計回りに移動する爆撃エリアを生成し、範囲内の敵を攻撃します。',
        upgrades: [
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮'
        ],
        create: () => new WhiteDove()
    },
    {
        id: 'blackDove',
        title: '漆黒の鳩',
        type: 'weapon',
        desc: '反時計回りに移動する爆撃エリアを生成し、範囲内の敵を攻撃します。',
        upgrades: [
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮',
            '威力アップ、範囲拡大、投下数+2、クールダウン短縮'
        ],
        create: () => new BlackDove()
    }
];

const availableSkills = [
    {
        id: 'range',
        title: '範囲拡大',
        type: 'passive',
        desc: '攻撃範囲（半径と角度）が広がります。',
        apply: () => { player.attackRange += 30; player.attackAngleSpan += Math.PI / 12; }
    },
    {
        id: 'speed',
        title: '攻撃速度UP',
        type: 'passive',
        desc: '攻撃の間隔が短くなります。',
        apply: () => { player.fireRate = Math.max(100, player.fireRate - 100); }
    },
    {
        id: 'hpUp',
        title: '最大HPアップ',
        type: 'passive',
        desc: '最大HPが20上がり、HPが全回復します。（残り3回）',
        maxCount: 3,
        count: 0,
        apply: () => { player.maxHp += 20; player.hp = player.maxHp; }
    },
    {
        id: 'attackUp',
        title: '攻撃力UP',
        type: 'passive',
        desc: '敵に与えるダメージが増加します。',
        apply: () => { player.attackPower += 5; }
    },
    {
        id: 'expUp',
        title: '経験値獲得量UP',
        type: 'passive',
        desc: 'ジェムから得られる経験値が20%増加します。',
        apply: () => { player.expMultiplier += 0.2; }
    }
];

weaponDefinitions.forEach(wDef => {
    availableSkills.push({
        id: wDef.id,
        title: wDef.title,
        type: wDef.type,
        maxLevel: 7,
        desc: wDef.desc,
        upgrades: wDef.upgrades,
        apply: () => {
            const existing = player.weapons.find(w => w.id === wDef.id);
            if (existing) {
                existing.levelUp();
            } else {
                player.weapons.push(wDef.create());
            }
        }
    });
});

// オブジェクト配列
let gems = [];
let enemies = [];
let rocks = [];
let projectiles = [];
let agriFields = [];
let cleanWaves = [];
let lightnings = [];
let enemySpawnTimer = 0;
let enemySpawnInterval = 1000;

function killEnemy(enemy) {
    enemy.markedForDeletion = true;
    if (enemy instanceof Boss) {
        score += enemy.isFinalBoss ? 5000 : 500;
        for (let i = 0; i < 20; i++) {
            const gx = enemy.x + (Math.random() - 0.5) * 60;
            const gy = enemy.y + (Math.random() - 0.5) * 60;
            gems.push(new Gem(gx, gy));
        }
        if (enemy.isFinalBoss) {
            isGameClear = true;
        }
    } else {
        gems.push(new Gem(enemy.x, enemy.y));
        score += 10;
    }
    updateUI();
}

class Projectile {
    constructor(x, y, angle, power, range) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 50; // 初速
        this.maxSpeed = 600; // 視認性を保つ最大速度
        this.acceleration = 800; // 発射直後から加速する
        this.timer = 0; // 経過時間を記録するタイマー
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.radius = 6;
        this.power = power;
        this.distanceTraveled = 0;
        this.maxRange = range * 4; // 弾は攻撃範囲より遠くまで飛ぶ
        this.markedForDeletion = false;
        this.hitEnemies = new Set();
        this.color = '#66fcf1';
        this.isPCWeapon = false;
        
        // PC武器用のランダムな文字情報を初期化時に決めておく
        if (typeof pcWeaponLetters !== 'undefined') {
            this.letterConfig = pcWeaponLetters[Math.floor(Math.random() * pcWeaponLetters.length)];
        }
    }
    update(dt) {
        this.timer += dt;

        // 発射直後から加速処理を行う
        if (this.speed < this.maxSpeed) {
            this.speed += this.acceleration * (dt / 1000);
            if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
            // 速度が変わったのでvxとvyを再計算
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }

        const moveDist = this.speed * (dt / 1000);
        this.x += this.vx * (dt / 1000);
        this.y += this.vy * (dt / 1000);
        this.distanceTraveled += moveDist;
        if (this.distanceTraveled > this.maxRange) {
            this.markedForDeletion = true;
        }
    }
    draw(ctx) {
        if (this.isKnife && typeof knifeWeaponImg !== 'undefined' && knifeWeaponImg.complete && knifeWeaponImg.naturalWidth !== 0) {
            ctx.save();
            ctx.translate(this.x, this.y);
            // 刃先が飛ぶ方向を向くように調整するためのオフセット（左向き画像を右向きに合わせるため180度回転）
            const offsetAngle = Math.PI;
            ctx.rotate(this.angle + offsetAngle);
            ctx.imageSmoothingEnabled = false;
            
            const drawW = 70;
            const aspect = knifeWeaponImg.naturalHeight / knifeWeaponImg.naturalWidth;
            const drawH = drawW * aspect;
            
            ctx.drawImage(knifeWeaponImg, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
            return;
        }

        if (this.isPCWeapon && typeof pcBulletImg !== 'undefined' && pcBulletImg.complete && pcBulletImg.naturalWidth !== 0 && this.letterConfig) {
            ctx.save();
            ctx.translate(this.x, this.y);
            // 弾の進行方向に合わせて文字を回転させる
            // ctx.rotate(this.angle); // 文字として読ませるため、あえて回転させない設定にしています
            ctx.imageSmoothingEnabled = false;
            
            const l = this.letterConfig;
            
            // 元のサイズ（高さ約40px）にスケール
            const scale = 40 / l.h;
            const drawW = l.w * scale;
            const drawH = l.h * scale;
            
            ctx.drawImage(pcBulletImg, l.x, l.y, l.w, l.h, -drawW / 2, -drawH / 2, drawW, drawH);
            
            ctx.restore();
            return;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class AgriField {
    constructor(x, y, power, range, isDebuffed = false) {
        this.x = x;
        this.y = y;
        this.isDebuffed = isDebuffed;
        this.radius = range * (isDebuffed ? 0.65 : 1.0); // デバフ時は範囲を狭める
        this.power = power * 0.15; // ダメージを低減
        this.maxDuration = 2000;
        this.duration = this.maxDuration; // 持続時間は2秒
        this.tickInterval = 500; // 0.5秒間隔でダメージ
        this.tickTimer = 0; // 最初に即ダメージが入るように0からスタート
        this.markedForDeletion = false;
    }

    update(dt, enemies) {
        this.duration -= dt;
        if (this.duration <= 0) {
            this.markedForDeletion = true;
            return;
        }

        this.tickTimer -= dt;
        if (this.tickTimer <= 0) {
            this.tickTimer = this.tickInterval;

            enemies.forEach(enemy => {
                if (enemy.markedForDeletion) return;
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= this.radius + enemy.radius) {
                    // 一定間隔ごとにまとめてダメージ
                    enemy.hp -= this.power;
                    if (enemy.hp <= 0) {
                        killEnemy(enemy);
                    }
                }
            });
        }
    }

    draw(ctx) {
        const alpha = Math.max(0, this.duration / this.maxDuration);

        if (agriWeaponImg.complete && agriWeaponImg.naturalWidth !== 0) {
            ctx.save();
            ctx.globalAlpha = alpha * 0.85; // 地面に馴染む半透明度
            if (this.isDebuffed) {
                // 攻撃力低下デバフ時は紫色・弱体化トーンに色味を変化
                ctx.filter = 'hue-rotate(65deg) saturate(1.5) brightness(0.9)';
            }
            const drawSize = this.radius * 2.5; // 当たり判定の円にスプラッシュ中央がフィットするサイズ
            ctx.drawImage(
                agriWeaponImg,
                this.x - drawSize / 2,
                this.y - drawSize / 2,
                drawSize,
                drawSize
            );
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            if (this.isDebuffed) {
                ctx.fillStyle = `rgba(180, 100, 255, ${alpha * 0.5})`;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgba(140, 60, 220, ${alpha * 0.7})`;
                ctx.stroke();
            } else {
                ctx.fillStyle = `rgba(100, 255, 100, ${alpha * 0.5})`;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgba(50, 200, 50, ${alpha * 0.7})`;
                ctx.stroke();
            }
        }
    }
}

class HolyWaterArea {
    constructor(x, y, power, range) {
        this.x = x;
        this.y = y;
        this.radius = range * 1.0;
        this.power = power * 0.15;
        this.maxDuration = 2000;
        this.duration = this.maxDuration;
        this.tickInterval = 500;
        this.tickTimer = 0;
        this.markedForDeletion = false;
    }

    update(dt, enemies) {
        this.duration -= dt;
        if (this.duration <= 0) {
            this.markedForDeletion = true;
            return;
        }

        this.tickTimer -= dt;
        if (this.tickTimer <= 0) {
            this.tickTimer = this.tickInterval;

            enemies.forEach(enemy => {
                if (enemy.markedForDeletion) return;
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= this.radius + enemy.radius) {
                    enemy.hp -= this.power;
                    if (enemy.hp <= 0) {
                        killEnemy(enemy);
                    }
                }
            });
        }
    }

    draw(ctx) {
        const alpha = Math.max(0, this.duration / this.maxDuration);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 100, ${alpha * 0.5})`;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(50, 200, 50, ${alpha * 0.7})`;
        ctx.stroke();
    }
}

class CleanWave {
    constructor(player, angle, power, range) {
        this.player = player;
        this.angle = angle;
        // ゆったりとしたモーションにするため、速度と持続時間を調整
        this.expandSpeed = 450; // 広がる速度を遅く
        const isDebuffed = player && player.attackDebuffTimer > 0;
        this.width = isDebuffed ? 105 : 160; // デバフ時は横幅を狭める
        this.currentLength = 20; // 初期の長さ
        this.maxLength = isDebuffed ? range * 1.6 : range * 2.5; // デバフ時は最大射程を狭める
        this.power = power * 0.3; // 攻撃力
        this.duration = 750; // 攻撃の持続時間を長く（750ms）
        this.timer = 0;
        this.markedForDeletion = false;
        this.hitEnemies = new Set();
        this.particles = [];
    }

    update(dt) {
        this.timer += dt;
        
        if (this.currentLength < this.maxLength) {
            this.currentLength += this.expandSpeed * (dt / 1000);
            if (this.currentLength > this.maxLength) {
                this.currentLength = this.maxLength;
            }
            
            // 伸びている間、先端にしぶきパーティクルを生成
            for(let i=0; i<4; i++) {
                this.particles.push({
                    x: this.currentLength,
                    y: (Math.random() - 0.5) * this.width,
                    radius: Math.random() * 4 + 3, // 丸い水玉の半径
                    life: 1.0,
                    vx: Math.random() * 150 + 50,
                    vy: (Math.random() - 0.5) * 40
                });
            }
        }
        
        // パーティクルの更新
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx * (dt / 1000);
            p.y += p.vy * (dt / 1000);
            p.life -= dt / 300;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        if (this.timer > this.duration) {
            this.markedForDeletion = true;
        }
    }

    checkCollisionWithEnemy(enemy) {
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;

        // 波のローカル座標系に変換（逆回転）
        const localX = dx * Math.cos(-this.angle) - dy * Math.sin(-this.angle);
        const localY = dx * Math.sin(-this.angle) + dy * Math.cos(-this.angle);

        // 原点(0,0)からX軸正方向へ伸びる矩形
        const closestX = Math.max(0, Math.min(localX, this.currentLength));
        const closestY = Math.max(-this.width / 2, Math.min(localY, this.width / 2));

        const distanceX = localX - closestX;
        const distanceY = localY - closestY;

        return (distanceX * distanceX + distanceY * distanceY) < (enemy.radius * enemy.radius);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.player.x, this.player.y);
        ctx.rotate(this.angle);

        const alpha = Math.max(0, 1 - (this.timer / this.duration));

        if (typeof cleaningWeaponImg !== 'undefined' && cleaningWeaponImg.complete && cleaningWeaponImg.naturalWidth !== 0) {
            ctx.save();
            ctx.globalAlpha = alpha * 0.9;
            ctx.imageSmoothingEnabled = true;
            // 清掃.pngの有効画像領域（91, 371, 898, 323）を当たり判定の矩形に合わせて描画
            ctx.drawImage(
                cleaningWeaponImg,
                91, 371, 898, 323,
                0, -this.width / 2, this.currentLength, this.width
            );
            ctx.restore();
        } else {
            // メインの水部分（フォールバック）
            ctx.fillStyle = `rgba(60, 140, 255, ${alpha * 0.8})`;
            ctx.fillRect(0, -this.width / 2, this.currentLength, this.width);

            // 縁取り（明るい水色）
            ctx.fillStyle = `rgba(160, 230, 255, ${alpha})`;
            const edge = 8;
            ctx.fillRect(0, -this.width / 2, this.currentLength, edge);
            ctx.fillRect(0, this.width / 2 - edge, this.currentLength, edge);
            ctx.fillRect(0, -this.width / 2, edge, this.width);
        }

        // 飛び散る水しぶき（丸い水玉パーティクル）
        for (let p of this.particles) {
            ctx.fillStyle = `rgba(160, 230, 255, ${alpha * p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // モップ画像の描画（主人公が持っているように）
        if (typeof mopImg !== 'undefined' && mopImg.complete && mopImg.naturalWidth !== 0) {
            ctx.imageSmoothingEnabled = false;
            ctx.save();
            
            // アニメーションの進行度（0.0 〜 1.0）
            const progress = Math.min(this.timer / this.duration, 1.0);
            
            // サイン波の半周期を使って、ゆったりとした1往復の動きを作る (0 -> 1 -> 0)
            const sweep = Math.sin(progress * Math.PI);
            
            // 自機が持っているようにするため、原点(0,0)付近に柄が来るようにする。
            // ゆったりと前に押し出し、また戻るような動き
            const pushDist = sweep * 25; 
            ctx.translate(pushDist, 0);
            
            // 攻撃の揺れ（モップをゆったりと払うような動き）
            const wobble = sweep * 0.15;
            ctx.rotate(wobble);

            // モップ画像は右上が柄、左下がヘッド。
            // 右上を自機(原点)付近に合わせ、左下のヘッドを前方(右向き)に向ける。
            // そのためには画像を -135度 (-3π/4) 回転させる。
            ctx.rotate(-3 * Math.PI / 4); 
            
            const mopSize = 140; 
            // 右上(mopSize, 0)を原点にするため、x=-mopSize, y=0 で描画
            ctx.drawImage(mopImg, -mopSize, 0, mopSize, mopSize);
            ctx.restore();
        }

        ctx.restore();
    }
}

class MagicWand {
    constructor() {
        this.id = 'magicWand';
        this.level = 1;
        this.cooldown = 1200;
        this.timer = 0;
        this.power = 15;
    }
    levelUp() {
        this.level++;
        this.power += 5;
        this.cooldown = Math.max(200, this.cooldown - 150);
    }
    update(dt, player, enemies) {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = this.cooldown;
            this.fire(player, enemies);
        }
    }
    fire(player, enemies) {
        let closestEnemy = null;
        let minDistance = Infinity;
        for (const enemy of enemies) {
            if (enemy.markedForDeletion) continue;
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const dist = dx*dx + dy*dy;
            if (dist < minDistance) {
                minDistance = dist;
                closestEnemy = enemy;
            }
        }
        if (closestEnemy) {
            const angle = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
            const proj = new Projectile(player.x, player.y, angle, this.power, player.attackRange * 3);
            proj.color = '#ffccff';
            projectiles.push(proj);
            
            if (this.level >= 3) {
                 setTimeout(() => {
                     if (!closestEnemy.markedForDeletion) {
                         const angle2 = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
                         const proj2 = new Projectile(player.x, player.y, angle2, this.power, player.attackRange * 3);
                         proj2.color = '#ffccff';
                         projectiles.push(proj2);
                     }
                 }, 150);
            }
            if (this.level >= 5) {
                 setTimeout(() => {
                     if (!closestEnemy.markedForDeletion) {
                         const angle3 = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
                         const proj3 = new Projectile(player.x, player.y, angle3, this.power, player.attackRange * 3);
                         proj3.color = '#ffccff';
                         projectiles.push(proj3);
                     }
                 }, 300);
            }
            if (this.level >= 7) {
                 setTimeout(() => {
                     if (!closestEnemy.markedForDeletion) {
                         const angle4 = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
                         const proj4 = new Projectile(player.x, player.y, angle4, this.power, player.attackRange * 3);
                         proj4.color = '#ffccff';
                         projectiles.push(proj4);
                     }
                 }, 450);
            }
        }
    }
}

class Garlic {
    constructor() {
        this.id = 'garlic';
        this.level = 1;
        this.cooldown = 500;
        this.timer = 0;
        this.power = 5;
        this.radius = 80;
    }
    levelUp() {
        this.level++;
        this.power += 3;
        this.radius += 15;
    }
    update(dt, player, enemies) {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = this.cooldown;
            for (const enemy of enemies) {
                if (enemy.markedForDeletion) continue;
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                if (dx*dx + dy*dy <= this.radius * this.radius) {
                    enemy.hp -= this.power;
                    if (enemy.hp <= 0) killEnemy(enemy);
                    else {
                        enemy.x += dx * 0.05;
                        enemy.y += dy * 0.05;
                    }
                }
            }
        }
    }
    draw(ctx, player) {
        ctx.beginPath();
        ctx.arc(player.x, player.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    }
}

class Knife {
    constructor() {
        this.id = 'knife';
        this.level = 1;
        this.cooldown = 1000;
        this.timer = 0;
        this.power = 20;
    }
    levelUp() {
        this.level++;
        this.power += 5;
        this.cooldown = Math.max(300, this.cooldown - 100);
    }
    update(dt, player, enemies) {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = this.cooldown;
            this.fire(player);
        }
    }
    fire(player) {
        let angle = 0;
        if (player.direction === '前') angle = Math.PI / 2;
        else if (player.direction === '後ろ') angle = -Math.PI / 2;
        else if (player.direction === '左') angle = Math.PI;
        else if (player.direction === '右') angle = 0;

        const count = Math.floor((this.level - 1) / 2) + 1;
        for(let i=0; i<count; i++) {
            setTimeout(() => {
                const proj = new Projectile(player.x, player.y, angle, this.power, player.attackRange * 4);
                proj.color = '#cccccc';
                proj.isKnife = true;
                projectiles.push(proj);
            }, i * 150);
        }
    }
}

class HolyWaterWeapon {
    constructor() {
        this.id = 'holyWater';
        this.level = 1;
        this.cooldown = 2000;
        this.timer = 0;
        this.power = 10;
    }
    levelUp() {
        this.level++;
        this.power += 5;
        this.cooldown = Math.max(800, this.cooldown - 200);
    }
    update(dt, player, enemies) {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = this.cooldown;
            this.fire(player, enemies);
        }
    }
    fire(player, enemies) {
        const count = Math.floor((this.level - 1) / 2) + 1;
        for (let i = 0; i < count; i++) {
            const r = Math.random() * 300;
            const theta = Math.random() * Math.PI * 2;
            const targetX = player.x + Math.cos(theta) * r;
            const targetY = player.y + Math.sin(theta) * r;
            agriFields.push(new HolyWaterArea(targetX, targetY, this.power * 2, player.attackRange * 0.8));
        }
    }
}

class LightningEffect {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.duration = 300;
        this.markedForDeletion = false;
    }
    update(dt) {
        this.duration -= dt;
        if (this.duration <= 0) this.markedForDeletion = true;
    }
    draw(ctx) {
        const alpha = Math.max(0, this.duration / 300);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${alpha * 0.4})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(200, 255, 255, ${alpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 1000);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `rgba(200, 255, 255, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}

class LightningRing {
    constructor() {
        this.id = 'lightningRing';
        this.level = 1;
        this.cooldown = 2500;
        this.timer = 0;
        this.power = 30;
    }
    levelUp() {
        this.level++;
        this.power += 10;
        this.cooldown = Math.max(1000, this.cooldown - 300);
    }
    update(dt, player, enemies) {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = this.cooldown;
            this.fire(player, enemies);
        }
    }
    fire(player, enemies) {
        const visibleEnemies = enemies.filter(e => {
            return e.x > camera.x && e.x < camera.x + viewWidth &&
                   e.y > camera.y && e.y < camera.y + viewHeight;
        });
        
        const count = Math.floor((this.level - 1) / 2) + 1;
        
        for (let i = 0; i < count; i++) {
            if (visibleEnemies.length === 0) break;
            const idx = Math.floor(Math.random() * visibleEnemies.length);
            const target = visibleEnemies[idx];
            
            const radius = 60 + this.level * 5;
            lightnings.push(new LightningEffect(target.x, target.y, radius));
            
            for (const enemy of enemies) {
                if (enemy.markedForDeletion) continue;
                const dx = enemy.x - target.x;
                const dy = enemy.y - target.y;
                if (dx*dx + dy*dy <= radius * radius) {
                    enemy.hp -= this.power;
                    if (enemy.hp <= 0) killEnemy(enemy);
                }
            }
        }
    }
}

class Dove {
    constructor(id, title, color, isClockwise) {
        this.id = id;
        this.title = title;
        this.level = 1;
        this.cooldown = 1500; // 爆撃間隔
        this.timer = 0;
        this.power = 15;
        this.areaRadius = 70; // 爆撃エリアの広さ
        this.orbitRadius = 220; // プレイヤーからの距離
        this.orbitAngle = 0; // 現在の角度
        this.orbitSpeed = (isClockwise ? 1 : -1) * 1.2; // 回転速度（ラジアン/秒）
        this.color = color;
        this.bombs = [];
        this.bombsPerDrop = 1; // 一回に落ちる爆弾の数
    }
    
    levelUp() {
        this.level++;
        this.power += 5;
        this.areaRadius += 10;
        this.cooldown = Math.max(300, this.cooldown - 150);
        this.bombsPerDrop += 2; // レベルごとに弾を増やす
    }
    
    update(dt, player, enemies) {
        // 回転角度を更新
        this.orbitAngle += this.orbitSpeed * (dt / 1000);
        
        const targetX = player.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        const targetY = player.y + Math.sin(this.orbitAngle) * this.orbitRadius;
        
        // 爆撃タイマー
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = this.cooldown;
            
            // 爆弾生成時の鳩の位置を取得
            const doveX = player.x - Math.cos(this.orbitAngle) * 50;
            const doveY = player.y - Math.sin(this.orbitAngle) * 50;

            for (let i = 0; i < this.bombsPerDrop; i++) {
                // 照準サークル内のランダムな位置に落とす（極座標）
                const r = Math.sqrt(Math.random()) * this.areaRadius;
                const theta = Math.random() * Math.PI * 2;
                const bx = targetX + Math.cos(theta) * r;
                const by = targetY + Math.sin(theta) * r;
                
                this.bombs.push({
                    startX: doveX,
                    startY: doveY,
                    x: bx,
                    y: by,
                    radius: 35 + this.level * 4,
                    duration: 800,
                    maxDuration: 800,
                    hasHit: false,
                    particles: []
                });
            }
        }
        
        // 爆弾の更新と当たり判定
        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const b = this.bombs[i];
            b.duration -= dt;
            const progress = (b.maxDuration - b.duration) / b.maxDuration;
            
            // パーティクルの更新
            if (b.particles) {
                for (let j = b.particles.length - 1; j >= 0; j--) {
                    const p = b.particles[j];
                    p.x += p.vx * (dt / 1000);
                    p.y += p.vy * (dt / 1000);
                    p.life -= dt / 400; // 400msで消える
                    if (p.life <= 0) {
                        b.particles.splice(j, 1);
                    }
                }
            }

            if (b.duration <= 0) {
                this.bombs.splice(i, 1);
            } else if (!b.hasHit && progress >= 0.6) { // 投下後60%（480ms）経過時点で着弾
                b.hasHit = true;
                
                // ダメージ判定
                for (const enemy of enemies) {
                    if (enemy.markedForDeletion) continue;
                    const dx = enemy.x - b.x;
                    const dy = enemy.y - b.y;
                    if (dx * dx + dy * dy <= b.radius * b.radius) {
                        enemy.hp -= this.power;
                        if (enemy.hp <= 0) killEnemy(enemy);
                    }
                }
                
                // 爆発パーティクルの生成
                const particleCount = 12 + this.level * 2;
                const baseColor = this.id === 'whiteDove' ? '255, 230, 255' : '150, 0, 255';
                for (let k = 0; k < particleCount; k++) {
                    const speed = Math.random() * 150 + 50;
                    const angle = Math.random() * Math.PI * 2;
                    b.particles.push({
                        x: b.x,
                        y: b.y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: Math.random() * 4 + 3,
                        life: 1.0,
                        color: baseColor
                    });
                }
            }
        }
    }
    
    draw(ctx, player) {
        // 1. 鳩自体の描画
        const doveX = player.x - Math.cos(this.orbitAngle) * 50;
        const doveY = player.y - Math.sin(this.orbitAngle) * 50;
        const doveImg = doveSpriteImg;
        
        if (doveImg.complete && doveImg.naturalWidth !== 0) {
            const size = 35; // 鳩の描画サイズ
            ctx.save();
            ctx.translate(doveX, doveY);
            // 移動方向（X成分）を計算して画像を左右反転
            const vx = Math.sin(this.orbitAngle) * this.orbitSpeed;
            if (vx < 0) {
                ctx.scale(-1, 1);
            }
            
            // アニメーションフレーム（200msごとに切り替え）
            const frameIndex = Math.floor(performance.now() / 200) % 2;
            
            // スプライトの切り出し計算（2x2の画像）
            const sw = doveImg.naturalWidth / 2;
            const sh = doveImg.naturalHeight / 2;
            
            // X座標: 左が純白(0)、右が漆黒(1)
            const sx = this.id === 'whiteDove' ? 0 : sw;
            // Y座標: 上が羽上げ(0)、下が羽下げ(1)
            const sy = frameIndex * sh;
            
            ctx.drawImage(doveImg, sx, sy, sw, sh, -size / 2, -size / 2, size, size);
            ctx.restore();
        } else {
            // 画像ロード前のフォールバック
            ctx.beginPath();
            ctx.arc(doveX, doveY, 8, 0, Math.PI * 2);
            if (this.id === 'whiteDove') {
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ffffff';
            } else {
                ctx.fillStyle = '#111111';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#555555';
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // 2. 爆弾と爆発エフェクトの描画
        for (const b of this.bombs) {
            const progress = (b.maxDuration - b.duration) / b.maxDuration;
            
            if (progress < 0.6) {
                // 着弾前の状態：弧（ベジェ曲線）を描きながら爆弾が飛んでいく
                const t = progress / 0.6; // 0.0 -> 1.0 (着弾時に1.0)
                
                // 始点、制御点、終点の計算
                const p0x = b.startX;
                const p0y = b.startY;
                const p2x = b.x;
                const p2y = b.y;

                const midX = (p0x + p2x) / 2;
                const midY = (p0y + p2y) / 2;
                const dx = p2x - p0x;
                const dy = p2y - p0y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let cpX = midX;
                let cpY = midY;
                if (dist > 0) {
                    const perpX = -dy / dist;
                    const perpY = dx / dist;
                    const curveDirection = this.id === 'whiteDove' ? 1 : -1;
                    // 少し高めの弧を描かせる
                    const offset = Math.min(180, dist * 0.35);
                    cpX = midX + perpX * offset * curveDirection;
                    cpY = midY + perpY * offset * curveDirection;
                }

                // 軌道の細い線（全体）の描画
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(p0x, p0y);
                ctx.quadraticCurveTo(cpX, cpY, p2x, p2y);
                if (this.id === 'whiteDove') {
                    ctx.strokeStyle = 'rgba(102, 252, 241, 0.25)'; // 細い水色の線
                } else {
                    ctx.strokeStyle = 'rgba(150, 0, 255, 0.25)'; // 細い紫の線
                }
                ctx.lineWidth = 1.0;
                ctx.stroke();
                ctx.restore();

                // 爆弾が通過した軌跡を少し明るく描画
                if (t > 0) {
                    const p01x = (1 - t) * p0x + t * cpX;
                    const p01y = (1 - t) * p0y + t * cpY;
                    const p12x = (1 - t) * cpX + t * p2x;
                    const p12y = (1 - t) * cpY + t * p2y;
                    const p02x = (1 - t) * p01x + t * p12x;
                    const p02y = (1 - t) * p01y + t * p12y;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(p0x, p0y);
                    ctx.quadraticCurveTo(p01x, p01y, p02x, p02y);
                    if (this.id === 'whiteDove') {
                        ctx.strokeStyle = 'rgba(102, 252, 241, 0.65)';
                    } else {
                        ctx.strokeStyle = 'rgba(150, 0, 255, 0.65)';
                    }
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    ctx.restore();
                }

                // 爆弾本体の現在位置計算（ベジェ曲線上の点）
                const mt = 1 - t;
                const currentX = mt * mt * p0x + 2 * mt * t * cpX + t * t * p2x;
                const currentY = mt * mt * p0y + 2 * mt * t * cpY + t * t * p2y;

                // 爆弾本体の描画
                ctx.save();
                ctx.beginPath();
                ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
                if (this.id === 'whiteDove') {
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = '#66fcf1';
                } else {
                    ctx.fillStyle = '#1e0030';
                    ctx.strokeStyle = '#9600ff';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = '#9600ff';
                }
                ctx.fill();
                ctx.restore();
            }

            // 爆発パーティクルの描画（着弾後）
            if (b.particles) {
                for (const p of b.particles) {
                    ctx.save();
                    ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
                    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            }
        }
    }
}

class WhiteDove extends Dove {
    constructor() {
        super('whiteDove', '純白の鳩', '255, 255, 255', true);
    }
}

class BlackDove extends Dove {
    constructor() {
        super('blackDove', '漆黒の鳩', '50, 50, 50', false);
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.color = '#66fcf1';
        this.speed = 250;

        // 体力パラメータ
        this.maxHp = 100;
        this.hp = 100;
        this.invincibleTimer = 0; // 無敵時間タイマー(ms)

        // 近接攻撃パラメータ
        this.attackPower = 15; // 攻撃力
        this.fireRate = 800; // 攻撃間隔(ms)
        this.lastFireTime = 0;
        this.attackRange = 120; // 半径
        this.attackAngleSpan = Math.PI / 2; // 扇形の広がり（90度）

        // 成長パラメータ
        this.expMultiplier = 1.0; // 経験値獲得倍率

        // デバフ（状態異常）タイマー
        this.poisonTimer = 0;
        this.poisonTickTimer = 0;
        this.stunTimer = 0;
        this.attackDebuffTimer = 0;
        this.poisonParticles = []; // 毒もやパーティクル

        // 攻撃描画エフェクト用
        this.isAttacking = false;
        this.attackEffectDuration = 250; // ms
        this.attackEffectTimer = 0;
        this.currentAttackAngle = 0; // マウスへの角度

        // 多段ヒット防止用セット
        this.hitEnemiesThisSwing = new Set();

        // 向き
        this.direction = '前';
        this.weapons = [];
    }

    // 攻撃力計算（デバフ時：キッチン部門は少し低下、他部門は半減）
    get currentAttackPower() {
        if (this.attackDebuffTimer > 0) {
            if (selectedStageName === 'キッチン部門') {
                return this.attackPower * 0.75; // 少し下がる（25%低下）
            }
            return this.attackPower * 0.5;
        }
        return this.attackPower;
    }

    // 攻撃範囲計算（デバフ中は射程・幅を縮小）
    get currentAttackRange() {
        if (this.attackDebuffTimer > 0) {
            if (selectedStageName === 'キッチン部門') {
                return this.attackRange * 0.82; // 刃こぼれ包丁の短縮された刃渡りに合わせて射程を約82%に調整
            }
            if (selectedStageName === '農業部門' || selectedStageName === '清掃部門') {
                return this.attackRange * 0.65;
            }
        }
        return this.attackRange;
    }

    get currentAttackAngleSpan() {
        return this.attackAngleSpan;
    }

    update(dt) {
        // デバフ処理
        if (this.poisonTimer > 0) {
            this.poisonTimer -= dt;
            this.poisonTickTimer -= dt;
            if (this.poisonTickTimer <= 0) {
                this.hp -= 5; // 1秒ごとに5ダメージに強化
                if (this.hp <= 0) isGameOver = true;
                this.poisonTickTimer = 1000;
            }

            // 毒もやパーティクルの発生
            if (Math.random() < 0.4) {
                const activeImg = getCurrentPlayerImg(selectedStageName, selectedCharacter, this.direction);
                const playerDrawHeight = (activeImg && activeImg.complete && activeImg.naturalWidth !== 0)
                    ? (this.radius * 8.25 * 1.5)
                    : (this.radius * 2);
                const playerDrawWidth = (activeImg && activeImg.complete && activeImg.naturalWidth !== 0)
                    ? (playerDrawHeight * (activeImg.naturalWidth / activeImg.naturalHeight))
                    : (this.radius * 2);

                this.poisonParticles.push({
                    x: this.x + (Math.random() - 0.5) * playerDrawWidth * 0.9,
                    y: this.y + (Math.random() - 0.5) * playerDrawHeight * 0.9,
                    vx: (Math.random() - 0.5) * 25,
                    vy: -Math.random() * 30 - 15,
                    size: Math.random() * 40 + 30,
                    maxLife: 600 + Math.random() * 400,
                    life: 600 + Math.random() * 400,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 2.0
                });
            }
        }

        // 毒パーティクルの更新
        for (let i = this.poisonParticles.length - 1; i >= 0; i--) {
            const p = this.poisonParticles[i];
            p.life -= dt;
            if (p.life <= 0) {
                this.poisonParticles.splice(i, 1);
            } else {
                p.x += p.vx * (dt / 1000);
                p.y += p.vy * (dt / 1000);
                p.rotation += p.rotSpeed * (dt / 1000);
            }
        }

        if (this.attackDebuffTimer > 0) {
            this.attackDebuffTimer -= dt;
        }

        if (this.stunTimer > 0) {
            this.stunTimer -= dt;
        }

        let dx = 0; let dy = 0;
        let movingDir = null;
        // スタン中でない場合のみ移動と入力を受け付ける
        if (this.stunTimer <= 0) {
            // PCキーボード入力
            if (keys.w) { dy -= 1; movingDir = '後ろ'; }
            if (keys.s) { dy += 1; movingDir = '前'; }
            if (keys.a) { dx -= 1; movingDir = '左'; }
            if (keys.d) { dx += 1; movingDir = '右'; }

            // モバイルバーチャルスティック入力（MOVE）
            if (mobileInput.move.active) {
                dx = mobileInput.move.x;
                dy = mobileInput.move.y;

                const moveAngle = Math.atan2(dy, dx);
                if (moveAngle >= -Math.PI * 0.75 && moveAngle < -Math.PI * 0.25) {
                    movingDir = '後ろ';
                } else if (moveAngle >= Math.PI * 0.25 && moveAngle < Math.PI * 0.75) {
                    movingDir = '前';
                } else if (Math.abs(moveAngle) >= Math.PI * 0.75) {
                    movingDir = '左';
                } else {
                    movingDir = '右';
                }
            }
        }

        if (movingDir && movingDir !== this.direction) {
            this.direction = movingDir;
        }

        const inputLen = Math.hypot(dx, dy);
        if (inputLen > 1) {
            dx /= inputLen;
            dy /= inputLen;
        }

        this.x += dx * this.speed * (dt / 1000);
        this.y += dy * this.speed * (dt / 1000);

        this.x = Math.max(this.radius, Math.min(WORLD_WIDTH - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(WORLD_HEIGHT - this.radius, this.y));

        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= dt;
        }

        if (this.isAttacking) {
            this.attackEffectTimer -= dt;

            const currentRange = this.currentAttackRange;
            const currentSpan = this.currentAttackAngleSpan;

            // 攻撃中、進行度に応じて現在の剣の角度を更新し、敵との当たり判定を行う
            const progress = 1 - Math.max(0, this.attackEffectTimer / this.attackEffectDuration);
            const startAngle = this.currentAttackAngle - currentSpan / 2;
            const endAngle = this.currentAttackAngle + currentSpan / 2;
            const swordAngle = startAngle + (endAngle - startAngle) * progress;

            // 剣の範囲にいる敵にダメージを与える
            enemies.forEach(enemy => {
                if (enemy.markedForDeletion || this.hitEnemiesThisSwing.has(enemy)) return;

                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= currentRange + enemy.radius) {
                    const angleToEnemy = Math.atan2(dy, dx);
                    // 攻撃の基準角度（扇形の中心）からの差分
                    let angleDiff = angleToEnemy - this.currentAttackAngle;
                    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

                    // 扇形の範囲（＋少しの当たり判定の余裕）に入っているか
                    if (Math.abs(angleDiff) <= currentSpan / 2 + 0.3) {
                        this.hitEnemiesThisSwing.add(enemy); // 1回のスイングで1回だけ当たるようにする
                        enemy.hp -= this.currentAttackPower;

                        // 敵を倒した判定
                        if (enemy.hp <= 0) {
                            killEnemy(enemy);
                        } else {
                            // ヒット時のノックバック効果と0.5秒間のスタン（移動停止）
                            enemy.x += Math.cos(angleToEnemy) * 10;
                            enemy.y += Math.sin(angleToEnemy) * 10;
                            enemy.stunTimer = 500; // 500msスタン
                        }
                    }
                }
            });

            if (this.attackEffectTimer <= 0) {
                this.isAttacking = false;
                this.hitEnemiesThisSwing.clear(); // 攻撃が終わったらヒット履歴をクリア
            }
        }

        // 武器の更新
        this.weapons.forEach(w => w.update(dt, this, enemies));
    }

    draw(ctx) {
        // 武器のエフェクト描画（Garlicなど）
        this.weapons.forEach(w => {
            if (w.draw) w.draw(ctx, this);
        });

        // 毒パーティクルの描画（プレイヤーの背後・周囲に漂う毒もや）
        if (this.poisonParticles && this.poisonParticles.length > 0 && poisonMoyaImg.complete && poisonMoyaImg.naturalWidth !== 0) {
            ctx.save();
            for (const p of this.poisonParticles) {
                const alpha = (p.life / p.maxLife) * 0.7;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
                ctx.drawImage(poisonMoyaImg, -p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
            ctx.restore();
        }

        // プレイヤー本体
        if (this.invincibleTimer > 0 && Math.floor(performance.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // スタン中の痺れ振動
        let shakeX = 0;
        let shakeY = 0;
        if (this.stunTimer > 0) {
            shakeX = (Math.random() - 0.5) * 5;
            shakeY = (Math.random() - 0.5) * 5;
        }

        const activePlayerImg = getCurrentPlayerImg(selectedStageName, selectedCharacter, this.direction);
        const hasValidImg = activePlayerImg && activePlayerImg.complete && activePlayerImg.naturalWidth !== 0;

        if (hasValidImg) {
            const aspect = activePlayerImg.naturalWidth / activePlayerImg.naturalHeight;
            const drawHeight = this.radius * 8.25 * 1.5; // サイズをさらに1.5倍に大きく
            const drawWidth = drawHeight * aspect;

            ctx.save();
            ctx.translate(this.x + shakeX, this.y + shakeY);

            // スタンにかかっているとき、キャラの【背後】から電撃写真を配置（正円を隠し、数を多く配置、下側を開ける）
            if (this.stunTimer > 0 && stunEffectImg.complete && stunEffectImg.naturalWidth !== 0) {
                const now = performance.now();
                const frameIndex = Math.floor(now / 60); // 60msごとに電撃が激しく変化

                ctx.save();
                // 稲妻のネオングロー効果
                ctx.shadowColor = '#ffea00';
                ctx.shadowBlur = 15;

                // 左側の細い正円（光源球）を切り抜いて稲妻のみを描画
                const srcX = stunEffectImg.naturalWidth * 0.18;
                const srcY = 0;
                const srcW = stunEffectImg.naturalWidth - srcX;
                const srcH = stunEffectImg.naturalHeight;

                // 電撃の向きを逆にした配置（本数を4本に絞り、上・外側からキャラを包み込む向き、下側は開ける）
                const lightningConfigs = [
                    // 左背後・左肩（外側から内側・頭上へ向く逆向き電撃）
                    { baseAngle: 0.25, flipX: -1, flipY: 1, scale: 1.1, relX: -0.25, relY: -0.15, alpha: 1.0 },
                    // 右背後・右肩（外側から内側・頭上へ向く逆向き電撃）
                    { baseAngle: -0.25, flipX: 1, flipY: 1, scale: 1.1, relX: 0.25, relY: -0.15, alpha: 1.0 },
                    // 頭上中央（上から下・キャラへ降り注ぐ向き）
                    { baseAngle: Math.PI * 0.92, flipX: 1, flipY: 1, scale: 1.2, relX: 0.0, relY: -0.38, alpha: 1.0 },
                    // 頭上中央アーチ（上から下、反転）
                    { baseAngle: -Math.PI * 0.92, flipX: -1, flipY: 1, scale: 1.2, relX: 0.0, relY: -0.38, alpha: 1.0 }
                ];

                for (let i = 0; i < lightningConfigs.length; i++) {
                    const cfg = lightningConfigs[i];
                    const seed = (frameIndex * 13 + i * 29) % 100;
                    const jitterAngle = ((seed % 30) - 15) * (Math.PI / 180);
                    const jitterScale = 1.0 + ((seed % 20) - 10) * 0.015;
                    const flickerAlpha = cfg.alpha * (0.9 + ((seed % 10) / 100));

                    const eWidth = drawHeight * 1.1 * cfg.scale * jitterScale;
                    const eHeight = eWidth * (srcH / srcW);

                    ctx.save();
                    ctx.translate(cfg.relX * drawWidth, cfg.relY * drawHeight);
                    ctx.rotate(cfg.baseAngle + jitterAngle);
                    ctx.scale(cfg.flipX, cfg.flipY);
                    ctx.globalAlpha = Math.max(0.85, Math.min(1.0, flickerAlpha));

                    // 正円部分を除いた稲妻のみを重ね描き
                    ctx.drawImage(stunEffectImg, srcX, srcY, srcW, srcH, -eWidth * 0.45, -eHeight * 0.5, eWidth, eHeight);
                    ctx.drawImage(stunEffectImg, srcX, srcY, srcW, srcH, -eWidth * 0.45, -eHeight * 0.5, eWidth, eHeight);
                    ctx.restore();
                }

                ctx.restore();
            }

            // 攻撃力低下デバフ（キャラの背後・足元に泥濘・重力エフェクトを配置し、足取りが遅く見える演出）
            if (this.attackDebuffTimer > 0 && atkDownEffectImg.complete && atkDownEffectImg.naturalWidth !== 0) {
                const time = performance.now() * 0.002;
                const aspect = atkDownEffectImg.naturalHeight / atkDownEffectImg.naturalWidth;
                const pulse = Math.sin(time * 2.5) * 0.035;
                const eWidth = drawHeight * 1.65 * (1 + pulse);
                const eHeight = eWidth * aspect;
                const feetY = drawHeight * 0.32; // 少し上に移動して足元にピッタリ合わせる
                const drawY = feetY - eHeight * 0.72;

                ctx.save();
                ctx.globalAlpha = 0.92;
                ctx.drawImage(atkDownEffectImg, -eWidth / 2, drawY, eWidth, eHeight);
                ctx.restore();
            }

            // ドット絵をクッキリ描画（キャラ本体を手前に描画）
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(activePlayerImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

            // 攻撃力低下時、足先が泥に少し埋まっているような薄い手前影
            if (this.attackDebuffTimer > 0 && atkDownEffectImg.complete && atkDownEffectImg.naturalWidth !== 0) {
                const time = performance.now() * 0.002;
                const aspect = atkDownEffectImg.naturalHeight / atkDownEffectImg.naturalWidth;
                const pulse = Math.sin(time * 2.5) * 0.035;
                const eWidth = drawHeight * 1.65 * (1 + pulse);
                const eHeight = eWidth * aspect;
                const feetY = drawHeight * 0.32;
                const drawY = feetY - eHeight * 0.72;

                ctx.save();
                ctx.globalAlpha = 0.45;
                // 足元の泥部分のみ手前にも薄く重ねて足取りの重さを表現
                ctx.drawImage(atkDownEffectImg, -eWidth / 2, drawY, eWidth, eHeight);
                ctx.restore();
            }

            // 毒にかかっているとき、キャラの四角い領域・周囲に添付の毒もや写真をちりばめて描画
            if (this.poisonTimer > 0 && poisonMoyaImg.complete && poisonMoyaImg.naturalWidth !== 0) {
                const time = performance.now() * 0.003;
                const moyaConfigs = [
                    { relX: -0.28, relY: -0.32, sizeRatio: 0.85, speed: 1.0, phase: 0.0, baseAlpha: 0.7 },
                    { relX: 0.3, relY: -0.18, sizeRatio: 0.8, speed: 1.3, phase: 1.8, baseAlpha: 0.65 },
                    { relX: -0.22, relY: 0.22, sizeRatio: 0.9, speed: 0.8, phase: 3.2, baseAlpha: 0.75 },
                    { relX: 0.2, relY: 0.28, sizeRatio: 0.85, speed: 1.1, phase: 4.5, baseAlpha: 0.7 },
                    { relX: 0.0,   sizeRatio: 1.25, speed: 0.6, phase: 2.0, baseAlpha: 0.55 },
                    { relX: -0.05, relY: -0.45, sizeRatio: 0.75, speed: 1.5, phase: 5.1, baseAlpha: 0.65 }
                ];

                for (let i = 0; i < moyaConfigs.length; i++) {
                    const cfg = moyaConfigs[i];
                    const wave = Math.sin(time * cfg.speed + cfg.phase);
                    const waveCos = Math.cos(time * cfg.speed * 0.8 + cfg.phase);
                    const posX = (cfg.relX * drawWidth) + waveCos * 10;
                    const posY = (cfg.relY * drawHeight) + wave * 10;
                    const mSize = drawHeight * (cfg.sizeRatio || 0.85) * (0.9 + wave * 0.12);
                    const alpha = Math.max(0.2, Math.min(0.9, cfg.baseAlpha + wave * 0.25));

                    ctx.save();
                    ctx.translate(posX, posY);
                    ctx.rotate(wave * 0.25 + (i * 0.6));
                    ctx.globalAlpha = alpha;
                    ctx.drawImage(poisonMoyaImg, -mSize / 2, -mSize / 2, mSize, mSize);
                    ctx.restore();
                }
            }

            ctx.restore();
        } else {
            // 万が一のロード待ち時でも青丸は描かず、エフェクトのみ安全に描画
            if (this.stunTimer > 0 && stunEffectImg.complete && stunEffectImg.naturalWidth !== 0) {
                const now = performance.now();
                const frameIndex = Math.floor(now / 60);
                const srcX = stunEffectImg.naturalWidth * 0.18;
                const srcY = 0;
                const srcW = stunEffectImg.naturalWidth - srcX;
                const srcH = stunEffectImg.naturalHeight;

                ctx.save();
                ctx.translate(this.x + shakeX, this.y + shakeY - this.radius * 0.5);
                ctx.shadowColor = '#ffea00';
                ctx.shadowBlur = 15;
                const mSize = this.radius * 3.5;
                const rot = (((frameIndex * 37) % 60) - 30 + 180) * (Math.PI / 180);
                ctx.rotate(rot);
                ctx.globalAlpha = 1.0;
                ctx.drawImage(stunEffectImg, srcX, srcY, srcW, srcH, -mSize / 2, -mSize / 2, mSize, mSize);
                ctx.restore();
            }

            if (this.poisonTimer > 0 && poisonMoyaImg.complete && poisonMoyaImg.naturalWidth !== 0) {
                const time = performance.now() * 0.003;
                ctx.save();
                ctx.translate(this.x, this.y);
                const mSize = this.radius * 3.5;
                ctx.globalAlpha = 0.75;
                ctx.drawImage(poisonMoyaImg, -mSize / 2 + Math.sin(time) * 5, -mSize / 2 + Math.cos(time) * 5, mSize, mSize);
                ctx.restore();
            }
        }

        ctx.globalAlpha = 1.0;

        // 攻撃エフェクト（剣の軌跡と棒状の剣）
        if (this.isAttacking) {
            const currentRange = this.currentAttackRange;
            const currentSpan = this.currentAttackAngleSpan;

            const progress = 1 - Math.max(0, this.attackEffectTimer / this.attackEffectDuration);
            const startAngle = this.currentAttackAngle - currentSpan / 2;
            const endAngle = this.currentAttackAngle + currentSpan / 2;
            const currentSwordAngle = startAngle + (endAngle - startAngle) * progress;

            const currentKnifeImg = (this.attackDebuffTimer > 0 && knifeDebuffImg.complete && knifeDebuffImg.naturalWidth !== 0)
                ? knifeDebuffImg
                : knifeImg;

            if (selectedStageName === 'キッチン部門' && currentKnifeImg.complete && currentKnifeImg.naturalWidth !== 0) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(currentSwordAngle);
                
                // 元画像の比率を維持して描画（ドット絵をくっきりさせる）
                ctx.imageSmoothingEnabled = false;
                const knifeWidth = this.attackRange;
                const aspect = currentKnifeImg.naturalHeight / currentKnifeImg.naturalWidth;
                const knifeHeight = knifeWidth * aspect;
                
                ctx.scale(-1, 1);
                ctx.drawImage(currentKnifeImg, -knifeWidth, -knifeHeight / 2, knifeWidth, knifeHeight);
                ctx.restore();
            } else {
                // 剣の軌跡を薄く残す
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                // 進行方向（時計回り）に円弧を描く
                ctx.arc(this.x, this.y, currentRange, startAngle, currentSwordAngle);
                ctx.lineTo(this.x, this.y);
                ctx.fillStyle = `rgba(255, 0, 255, 0.15)`; // マゼンタ薄め
                ctx.fill();

                // 剣本体（一本の棒）を描画
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(
                    this.x + Math.cos(currentSwordAngle) * currentRange,
                    this.y + Math.sin(currentSwordAngle) * currentRange
                );
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#ff00ea'; // ネオンマゼンタ
                ctx.lineCap = 'round';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ff00ea';
                ctx.stroke();

                // スタイルリセット
                ctx.lineCap = 'butt';
                ctx.shadowBlur = 0;
                ctx.lineWidth = 1;
            }
        }

        // デバフのテキスト表示（キャラクター頭上、大きく見やすいフォント・黒縁取りと発光効果）
        const playerDrawHeight = (activePlayerImg && activePlayerImg.complete && activePlayerImg.naturalWidth !== 0)
            ? (this.radius * 8.25 * 1.5)
            : (this.radius * 2);
    }

    tryFire(currentTime) {
        if (currentTime - this.lastFireTime > this.fireRate) {
            this.lastFireTime = currentTime;
            this.fire();
        }
    }

    fire() {
        const attackAngle = getPlayerAttackAngle(this);

        if (selectedStageName === 'PC部門') {
            const angle = attackAngle;
            const spread = Math.PI / 12; // 15度の拡散

            if (this.attackDebuffTimer > 0) {
                // 攻撃力低下デバフ中は弾の数を3つから2つに減少（2Way発射）
                const p1 = new Projectile(this.x, this.y, angle - spread * 0.5, this.currentAttackPower, this.attackRange);
                const p2 = new Projectile(this.x, this.y, angle + spread * 0.5, this.currentAttackPower, this.attackRange);
                
                p1.isPCWeapon = true;
                p2.isPCWeapon = true;

                projectiles.push(p1);
                projectiles.push(p2);
            } else {
                // 通常時は3方向に発射
                const p1 = new Projectile(this.x, this.y, angle, this.currentAttackPower, this.attackRange);
                const p2 = new Projectile(this.x, this.y, angle - spread, this.currentAttackPower, this.attackRange);
                const p3 = new Projectile(this.x, this.y, angle + spread, this.currentAttackPower, this.attackRange);
                
                p1.isPCWeapon = true;
                p2.isPCWeapon = true;
                p3.isPCWeapon = true;

                projectiles.push(p1);
                projectiles.push(p2);
                projectiles.push(p3);
            }

            this.isAttacking = false;
            return;
        }

        if (selectedStageName === '農業部門') {
            const isDebuffed = this.attackDebuffTimer > 0;
            agriFields.push(new AgriField(this.x, this.y, this.currentAttackPower, this.attackRange, isDebuffed));
            this.isAttacking = false;
            return;
        }

        if (selectedStageName === '清掃部門') {
            const angle = attackAngle;
            cleanWaves.push(new CleanWave(this, angle, this.currentAttackPower, this.attackRange));
            this.isAttacking = false;
            return;
        }

        this.isAttacking = true;
        // キッチン部門の包丁は振りを遅く（500ms）、それ以外は250ms
        this.attackEffectDuration = selectedStageName === 'キッチン部門' ? 500 : 250;
        this.attackEffectTimer = this.attackEffectDuration;
        // 攻撃角度を決定（PCマウス/モバイルATTACKスティック共通）
        this.currentAttackAngle = attackAngle;

        // 当たり判定は update 内のアニメーション進行に合わせて行うため、ここでの一括判定は削除
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 18;
        this.color = '#ff4d4d';
        this.speed = Math.random() * 50 + 50;

        // 時間経過で敵のHPと攻撃力が少しずつ上がる
        this.maxHp = 20 + Math.floor(score / 150) * 5;
        this.hp = this.maxHp;
        this.attackPower = 10 + Math.floor(score / 200) * 2;

        this.stunTimer = 0; // スタン時間(ms)
        this.markedForDeletion = false;
    }

    update(dt, player) {
        if (this.stunTimer > 0) {
            this.stunTimer -= dt;
            return; // スタン中は移動しない
        }

        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed * (dt / 1000);
        this.y += Math.sin(angle) * this.speed * (dt / 1000);
    }

    draw(ctx) {
        let drawn = false;
        let enemyDrawHeight = this.radius * 2;

        if (selectedStageName === 'PC部門') {
            if (this.spriteIndex !== undefined && pcEnemiesImg.complete && pcEnemiesImg.naturalWidth !== 0) {
                const numSprites = 4;
                const spriteWidth = pcEnemiesImg.naturalWidth / numSprites;
                const spriteHeight = pcEnemiesImg.naturalHeight;

                const scale = 12.0; // PC部門の基本スケール
                const targetHeight = this.radius * scale;
                const aspect = spriteWidth / spriteHeight;
                const targetWidth = targetHeight * aspect;

                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    pcEnemiesImg,
                    spriteWidth * this.spriteIndex, 0, spriteWidth, spriteHeight,
                    this.x - targetWidth / 2, this.y - targetHeight / 2, targetWidth, targetHeight
                );
                drawn = true;
                enemyDrawHeight = targetHeight;
            }
        } else {
            let imgArray;
            if (selectedStageName === 'キッチン部門') imgArray = kitchenEnemiesImgs;
            else if (selectedStageName === '清掃部門') imgArray = cleaningEnemiesImgs;
            else if (selectedStageName === '農業部門') imgArray = agricultureEnemiesImgs;

            if (imgArray && this.spriteIndex !== undefined && this.spriteIndex < imgArray.length) {
                const currentEnemyImg = imgArray[this.spriteIndex];
                if (currentEnemyImg.complete && currentEnemyImg.naturalWidth !== 0) {
                    const scale = 12.0 * 1.5; // 半分の1.5倍に変更
                    const targetHeight = this.radius * scale;
                    const aspect = currentEnemyImg.naturalWidth / currentEnemyImg.naturalHeight;
                    const targetWidth = targetHeight * aspect;

                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(
                        currentEnemyImg,
                        0, 0, currentEnemyImg.naturalWidth, currentEnemyImg.naturalHeight,
                        this.x - targetWidth / 2, this.y - targetHeight / 2, targetWidth, targetHeight
                    );
                    drawn = true;
                    enemyDrawHeight = targetHeight;
                }
            }
        }

        if (!drawn) {
            // 敵本体（画像がない場合のフォールバック）
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            enemyDrawHeight = this.radius * 2;
        }

        // 敵のHPバー描画（ダメージを受けている場合のみ表示）
        if (this.hp < this.maxHp) {
            const barWidth = 36;
            const barHeight = 5;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.radius - 25;

            // 背景（赤）
            ctx.fillStyle = '#ff4d4d';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // 残りHP（緑）
            const hpPercent = Math.max(0, this.hp / this.maxHp);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

            // 枠線
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
    }

    applyHitEffect(player) {
        // デフォルトは特になし
    }
}

class ErraticEnemy extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.color = '#ff9900'; // オレンジ
        this.spriteIndex = 0; // 左から1番目の画像
        this.moveTimer = 0;
        this.currentAngle = 0;
        this.speed = Math.random() * 50 + 150; // ダッシュするので少し速めに設定
    }
    update(dt, player) {
        if (this.stunTimer > 0) {
            this.stunTimer -= dt;
            return;
        }

        this.moveTimer -= dt;
        if (this.moveTimer <= 0) {
            const r = Math.random();
            const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
            if (r < 0.3) {
                this.currentAngle = angleToPlayer; // 近づく
            } else if (r < 0.6) {
                this.currentAngle = angleToPlayer + Math.PI; // 遠ざかる
            } else {
                this.currentAngle = Math.random() * Math.PI * 2; // ランダム
            }
            this.moveTimer = 1000 + Math.random() * 1000;
        }

        this.x += Math.cos(this.currentAngle) * this.speed * (dt / 1000);
        this.y += Math.sin(this.currentAngle) * this.speed * (dt / 1000);
    }
}

class PoisonEnemy extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.color = '#33cc33'; // 緑
        this.spriteIndex = 1; // 左から2番目の画像
    }
    applyHitEffect(player) {
        player.poisonTimer = 5000; // 5秒間毒
        player.poisonTickTimer = 1000; // 1秒ごとにダメージ
    }
}

class StunEnemy extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.color = '#ffff00'; // 黄色
        this.attackPower = 0; // 攻撃力0
        this.spriteIndex = 2; // 左から3番目の画像
    }
    applyHitEffect(player) {
        player.stunTimer = 1000; // 1秒移動不可
    }
}

class DebuffEnemy extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.color = '#cc33ff'; // 紫
        this.attackPower = 0; // 攻撃力0
        this.spriteIndex = 3; // 左から4番目の画像
        this.dashTimer = 0;
        this.isDashing = false;
        this.dashDuration = 0;
        this.dashAngle = 0;
    }
    update(dt, player) {
        if (this.stunTimer > 0) {
            this.stunTimer -= dt;
            return;
        }

        if (this.isDashing) {
            this.dashDuration -= dt;
            this.x += Math.cos(this.dashAngle) * (this.speed * 3) * (dt / 1000);
            this.y += Math.sin(this.dashAngle) * (this.speed * 3) * (dt / 1000);
            if (this.dashDuration <= 0) {
                this.isDashing = false;
                this.dashTimer = 2000;
            }
        } else {
            this.dashTimer -= dt;
            if (this.dashTimer <= 0) {
                this.isDashing = true;
                this.dashDuration = 500;
                this.dashAngle = Math.atan2(player.y - this.y, player.x - this.x);
            } else {
                const angle = Math.atan2(player.y - this.y, player.x - this.x);
                this.x += Math.cos(angle) * (this.speed * 0.5) * (dt / 1000);
                this.y += Math.sin(angle) * (this.speed * 0.5) * (dt / 1000);
            }
        }
    }
    applyHitEffect(player) {
        player.attackDebuffTimer = 5000; // 5秒間攻撃力低下
    }
}

class Boss extends Enemy {
    constructor(x, y, isFinalBoss) {
        super(x, y);
        this.isFinalBoss = isFinalBoss;

        if (isFinalBoss) {
            this.radius = 67.5;
            this.maxHp = 2500 + score; // ラスボス
            this.hp = this.maxHp;
            this.attackPower = 40;
            this.speed = 35;
        } else {
            this.radius = 45;
            this.maxHp = 600 + score / 2; // ラウンドボス
            this.hp = this.maxHp;
            this.attackPower = 25;
            this.speed = 45;
        }
    }

    draw(ctx) {
        const size = this.radius * 2.5;
        const glowColor = this.isFinalBoss ? '#cc0000' : '#ff8800';
        const fillColor = this.isFinalBoss ? 'rgba(180, 0, 0, 0.5)' : 'rgba(255, 130, 0, 0.45)';

        // 後ろに発光する円を描いてボスを目立たせる
        ctx.save();
        ctx.shadowBlur = 50;
        ctx.shadowColor = glowColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.restore();

        // ボス画像を描画（ctx.filterで着色して白背景に埋もれないようにする）
        if (bossImg.complete && bossImg.naturalWidth !== 0) {
            ctx.save();
            ctx.translate(this.x, this.y);
            if (player.x < this.x) ctx.scale(-1, 1);
            ctx.imageSmoothingEnabled = false;
            ctx.filter = this.isFinalBoss
                ? 'brightness(0.6) sepia(1) hue-rotate(310deg) saturate(5)'
                : 'brightness(0.5) sepia(1) hue-rotate(20deg) saturate(4)';
            ctx.drawImage(bossImg, -size / 2, -size / 2, size, size);
            ctx.filter = 'none';
            ctx.restore();
        }

        // HPバーは常に表示
        const barWidth = this.radius * 2.5;
        const barHeight = 10;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.radius - 20;
        ctx.fillStyle = '#550000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        const hpPercent = Math.max(0, this.hp / this.maxHp);
        ctx.fillStyle = this.isFinalBoss ? '#ff2222' : '#ff8800';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // ボス名ラベル
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${this.isFinalBoss ? 16 : 13}px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(this.isFinalBoss ? 'FINAL BOSS' : 'BOSS', this.x, barY - 4);
        ctx.textAlign = 'left';
    }
}

class Gem {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.color = '#00ff00'; // 緑
        this.markedForDeletion = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.radius);
        ctx.lineTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x, this.y + this.radius);
        ctx.lineTo(this.x - this.radius, this.y);
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class Rock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 45; // 岩の当たり判定サイズ
        this.spriteIndex = Math.floor(Math.random() * 9); // 木箱用のランダムなスプライト (0〜8)
    }

    getHitbox() {
        if (selectedStageName === '農業部門') {
            // 木箱全体をがっちりカバーするように当たり判定の高さを増やす
            return { w: 100, h: 100 }; 
        } else if (selectedStageName === 'PC部門') {
            // PC部門の段ボール用当たり判定（画像に合わせて少し大きめ）
            return { w: 100, h: 100 };
        } else if (selectedStageName === '清掃部門') {
            // 清掃部門のゴミ箱用当たり判定（少し縦長）
            return { w: 80, h: 100 };
        } else if (selectedStageName === 'キッチン部門') {
            // キッチン部門の段ボール用当たり判定（上方向へ伸ばした判定）
            return { w: 90, h: 140, offsetY: -25 };
        } else {
            return { w: 80, h: 80 }; // 通常の岩用の判定
        }
    }

    draw(ctx) {
        if (selectedStageName === '農業部門' && typeof boxImg !== 'undefined' && boxImg.complete && boxImg.naturalWidth !== 0) {
            // 1000x1000の画像内に配置された9種類の木箱の正確な座標（250x250マス）
            const boxCoords = [
                [0, 0], [500, 0],
                [0, 250], [500, 250],
                [0, 500], [500, 500],
                [0, 750], [250, 750], [500, 750]
            ];
            const [sx, sy] = boxCoords[this.spriteIndex % boxCoords.length];
            
            // 250x250の正方形スライスのため縦横比1:1で描画
            const targetWidth = this.radius * 3.0; 
            const targetHeight = targetWidth;

            // 切り出し領域の中心に木箱が来るため、左右のオフセットは不要
            // 当たり判定をさらに上へ動かすため、画像の描画位置を下げる（Y座標のマイナスを小さくする）
            ctx.drawImage(boxImg, sx, sy, 250, 250, this.x - targetWidth / 2, this.y - targetHeight / 4, targetWidth, targetHeight);
        } else if (selectedStageName === 'PC部門' && typeof cardboardImg !== 'undefined' && cardboardImg.complete && cardboardImg.naturalWidth !== 0) {
            // PC部門用の段ボール描画（少し大きめ）
            const size = this.radius * 3.5; 
            ctx.drawImage(cardboardImg, this.x - size / 2, this.y - size / 2, size, size);
        } else if (selectedStageName === '清掃部門' && typeof trashcanImg !== 'undefined' && trashcanImg.complete && trashcanImg.naturalWidth !== 0) {
            // 清掃部門用のゴミ箱描画（縦長の比率に合わせて調整）
            const size = this.radius * 3.0; 
            ctx.drawImage(trashcanImg, this.x - size / 2, this.y - size / 2, size, size);
        } else if (selectedStageName === 'キッチン部門' && typeof kitchenCardboardImg !== 'undefined' && kitchenCardboardImg.complete && kitchenCardboardImg.naturalWidth !== 0) {
            // キッチン部門用の段ボール描画
            const size = this.radius * 3.0; 
            ctx.drawImage(kitchenCardboardImg, this.x - size / 2, this.y - size / 2, size, size);
        } else if (rockImg.complete && rockImg.naturalWidth !== 0) {
            const size = this.radius * 2.5; // 画像の描画サイズ
            ctx.drawImage(rockImg, this.x - size / 2, this.y - size / 2, size, size);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#444';
            ctx.fill();
        }
    }
}

let player;

function init() {
    player = new Player(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    gems = [];
    enemies = [];
    rocks = [];
    projectiles = [];
    agriFields = [];
    cleanWaves = [];
    lightnings = [];

    // 岩をランダムに配置（10～30個、隣り合わせや通行不能が発生しないよう最小距離を設定）
    const numRocks = Math.floor(Math.random() * 21) + 10;
    const MIN_ROCK_DISTANCE = 260; // 障害物同士の最小距離（プレイヤーが全方向から自由に通過できる間隔）
    const EDGE_MARGIN = 180; // マップ端からの最小余白

    for (let i = 0; i < numRocks; i++) {
        let rx, ry;
        let validPosition = false;
        let attempts = 0;

        while (!validPosition && attempts < 200) {
            attempts++;
            rx = EDGE_MARGIN + Math.random() * (WORLD_WIDTH - EDGE_MARGIN * 2);
            ry = EDGE_MARGIN + Math.random() * (WORLD_HEIGHT - EDGE_MARGIN * 2);

            // プレイヤーの初期位置（中央）付近には配置しない
            if (Math.abs(rx - WORLD_WIDTH / 2) < 300 && Math.abs(ry - WORLD_HEIGHT / 2) < 300) {
                continue;
            }

            // 既に配置されている他の障害物と近すぎないかチェック
            let tooClose = false;
            for (const r of rocks) {
                const distSq = (rx - r.x) * (rx - r.x) + (ry - r.y) * (ry - r.y);
                if (distSq < MIN_ROCK_DISTANCE * MIN_ROCK_DISTANCE) {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose) {
                validPosition = true;
            }
        }

        if (validPosition) {
            rocks.push(new Rock(rx, ry));
        }
    }

    // スキルの取得回数をリセット
    availableSkills.forEach(skill => {
        if (skill.count !== undefined) {
            skill.count = 0;
        }
    });

    score = 0;
    level = 1;
    exp = 0;
    nextLevelExp = 10;
    updateUI();

    currentWave = 1;
    waveTimer = waveDuration;
    enemySpawnInterval = 1000;
    bossActive = false;


    isGameStarted = true;
    isGameOver = false;
    isGameClear = false;
    isPaused = false;
    isLevelUpPaused = false; // レベルアップ中かどうかのフラグ
    gameOverScreen.classList.add('hidden');
    gameClearScreen.classList.add('hidden');
    levelUpScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');

    topBar.classList.remove('hidden');
    hpBarContainer.classList.remove('hidden');
    expBarContainer.classList.remove('hidden');

    // モバイルUIの表示制御
    if (isMobileMode) {
        if (mobileControls) mobileControls.classList.remove('hidden');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('hidden');
    }
    if (joystickMoveStick) updateStickVisual(joystickMoveStick, 0, 0);
    if (joystickAttackStick) updateStickVisual(joystickAttackStick, 0, 0);
    mobileInput.move.x = 0; mobileInput.move.y = 0; mobileInput.move.active = false;
    mobileInput.attack.active = false;

    lastTime = performance.now();
    animationId = requestAnimationFrame(gameLoop);
}

function togglePause() {
    if (!isGameStarted || isGameOver || isGameClear || isLevelUpPaused) return; // ゲームプレイ中以外やゲームオーバー/クリア時、レベルアップ中はポーズ不可

    isPaused = !isPaused;
    if (isPaused) {
        pauseScreen.classList.remove('hidden');
    } else {
        pauseScreen.classList.add('hidden');
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
}

function goToTitle() {
    isGameStarted = false;
    isGameOver = true; // ゲームループを止める
    isGameClear = true;
    isPaused = false;
    isLevelUpPaused = false;

    // UIを隠してスタート画面を出す
    pauseScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameClearScreen.classList.add('hidden');
    levelUpScreen.classList.add('hidden');

    // モバイルUIを隠す
    if (mobileControls) mobileControls.classList.add('hidden');
    if (mobileMenuBtn) mobileMenuBtn.classList.add('hidden');
    if (joystickMoveStick) updateStickVisual(joystickMoveStick, 0, 0);
    if (joystickAttackStick) updateStickVisual(joystickAttackStick, 0, 0);
    mobileInput.move.x = 0; mobileInput.move.y = 0; mobileInput.move.active = false;
    mobileInput.attack.active = false;

    topBar.classList.add('hidden');
    if (poisonStatusIcon) poisonStatusIcon.classList.add('hidden');
    if (atkDownStatusIcon) atkDownStatusIcon.classList.add('hidden');
    if (stunStatusIcon) stunStatusIcon.classList.add('hidden');
    hpBarContainer.classList.add('hidden');
    expBarContainer.classList.add('hidden');

    document.getElementById('stage-select-container').classList.remove('hidden');
    document.getElementById('character-select-container').classList.add('hidden');
    startScreen.classList.remove('hidden');

    // 背景をクリア
    ctx.fillStyle = '#0b0c10';
    ctx.fillRect(0, 0, viewWidth, viewHeight);
}

function updateUI() {
    scoreDisplay.innerText = `Score: ${score}`;
    levelDisplay.innerText = `Lv: ${level}`;
    waveDisplay.innerText = `Wave: ${currentWave} / ${maxWaves} [${selectedStageName}]`;

    if (bossActive) {
        timeDisplay.innerText = `Time: BOSS FIGHT!`;
        timeDisplay.style.color = '#ff3860';
        timeDisplay.style.textShadow = '2px 2px 0px #000000';
    } else {
        timeDisplay.innerText = `Time: ${Math.max(0, Math.ceil(waveTimer / 1000))}`;
        timeDisplay.style.color = '#ffffff';
        timeDisplay.style.textShadow = '2px 2px 0px #000000';
    }

    if (player) {
        const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
        hpBarFill.style.width = `${hpPercent}%`;
        if (hpText) {
            hpText.innerText = `HP: ${Math.max(0, Math.ceil(player.hp))} / ${player.maxHp}`;
        }

        // デバフ状態時にHPバーの下にアイコンバッジを表示
        if (poisonStatusIcon) {
            if (player.poisonTimer > 0) {
                poisonStatusIcon.classList.remove('hidden');
            } else {
                poisonStatusIcon.classList.add('hidden');
            }
        }
        if (atkDownStatusIcon) {
            if (player.attackDebuffTimer > 0) {
                atkDownStatusIcon.classList.remove('hidden');
            } else {
                atkDownStatusIcon.classList.add('hidden');
            }
        }
        if (stunStatusIcon) {
            if (player.stunTimer > 0) {
                stunStatusIcon.classList.remove('hidden');
            } else {
                stunStatusIcon.classList.add('hidden');
            }
        }
    }

    const expPercent = Math.min(100, (exp / nextLevelExp) * 100);
    expBarFill.style.width = `${expPercent}%`;
}

function spawnBoss(isFinalBoss) {
    // カメラ（画面）の端付近にスポーン
    const margin = 120;
    let x, y;
    if (Math.random() < 0.5) {
        x = camera.x + (Math.random() < 0.5 ? -margin : viewWidth + margin);
        y = camera.y + Math.random() * viewHeight;
    } else {
        x = camera.x + Math.random() * viewWidth;
        y = camera.y + (Math.random() < 0.5 ? -margin : viewHeight + margin);
    }
    x = Math.max(margin, Math.min(WORLD_WIDTH - margin, x));
    y = Math.max(margin, Math.min(WORLD_HEIGHT - margin, y));
    enemies.push(new Boss(x, y, isFinalBoss));
}

function spawnEnemy() {
    // カメラ（画面）の端付近にスポーン
    const margin = 50;
    let x, y;
    if (Math.random() < 0.5) {
        x = camera.x + (Math.random() < 0.5 ? -margin : viewWidth + margin);
        y = camera.y + Math.random() * viewHeight;
    } else {
        x = camera.x + Math.random() * viewWidth;
        y = camera.y + (Math.random() < 0.5 ? -margin : viewHeight + margin);
    }
    x = Math.max(margin, Math.min(WORLD_WIDTH - margin, x));
    y = Math.max(margin, Math.min(WORLD_HEIGHT - margin, y));

    let enemy;
    const r = Math.random();
    if (r < 0.2) enemy = new ErraticEnemy(x, y);
    else if (r < 0.4) enemy = new PoisonEnemy(x, y);
    else if (r < 0.6) enemy = new StunEnemy(x, y);
    else if (r < 0.8) enemy = new DebuffEnemy(x, y);
    else enemy = new Enemy(x, y);

    if (selectedStageName === 'PC部門') {
        if (enemy.constructor === Enemy) {
            enemy.spriteIndex = Math.floor(Math.random() * 4);
        }
    } else {
        let maxIndex = 6;
        if (selectedStageName === '清掃部門') maxIndex = 5;
        if (selectedStageName === '農業部門') maxIndex = 5;
        enemy.spriteIndex = Math.floor(Math.random() * maxIndex);
    }
    enemies.push(enemy);
}

function checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj1.radius + obj2.radius;
}

function triggerLevelUp() {
    isPaused = true;
    isLevelUpPaused = true;
    level++;
    exp -= nextLevelExp;
    nextLevelExp = Math.floor(nextLevelExp * 1.35); // 次の必要経験値増加
    updateUI();

    // スキル選択肢を生成
    skillOptionsContainer.innerHTML = '';

    const currentWeaponCount = player.weapons.length;
    const maxWeapons = 5;

    // 取得上限に達していないスキルのみを抽出
    const validSkills = availableSkills.filter(skill => {
        if (skill.maxCount && skill.count >= skill.maxCount) return false;
        
        if (skill.type === 'weapon') {
            const existingWeapon = player.weapons.find(w => w.id === skill.id);
            if (existingWeapon) {
                return existingWeapon.level < skill.maxLevel;
            } else {
                return currentWeaponCount < maxWeapons;
            }
        }
        
        return true;
    });

    // availableSkillsからランダムに最大3つ選ぶ
    const shuffled = [...validSkills].sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 3);

    choices.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        // 制限回数がある場合は残りの回数を表示
        let descText = skill.desc;
        if (skill.maxCount) {
            const remaining = skill.maxCount - skill.count;
            descText = descText.replace(/（残り.*回）/, `（残り${remaining}回）`);
        }

        let titleText = skill.title;
        if (skill.type === 'weapon') {
            const existingWeapon = player.weapons.find(w => w.id === skill.id);
            if (existingWeapon) {
                titleText += ` (Lv${existingWeapon.level + 1})`;
                if (skill.upgrades && skill.upgrades[existingWeapon.level - 1]) {
                    descText = skill.upgrades[existingWeapon.level - 1];
                }
            }
        }

        card.innerHTML = `
            <div class="skill-title">${titleText}</div>
            <div class="skill-desc">${descText}</div>
        `;
        card.addEventListener('click', () => {
            if (skill.count !== undefined) {
                skill.count++;
            }
            skill.apply();
            resumeGame();
        });
        skillOptionsContainer.appendChild(card);
    });

    levelUpScreen.classList.remove('hidden');
}

function resumeGame() {
    levelUpScreen.classList.add('hidden');
    isPaused = false;
    isLevelUpPaused = false;
    lastTime = performance.now(); // タイマーのズレを防ぐ
    requestAnimationFrame(gameLoop);
}

function update(dt, currentTime) {
    player.update(dt);
    player.tryFire(currentTime);

    projectiles.forEach(p => p.update(dt));
    agriFields.forEach(b => b.update(dt, enemies));
    cleanWaves.forEach(w => w.update(dt));
    lightnings.forEach(l => l.update(dt));

    // 清掃波と敵の当たり判定
    cleanWaves.forEach(w => {
        enemies.forEach(enemy => {
            if (enemy.markedForDeletion || w.markedForDeletion || w.hitEnemies.has(enemy)) return;
            if (w.checkCollisionWithEnemy(enemy)) {
                w.hitEnemies.add(enemy);
                enemy.hp -= w.power;

                if (enemy.hp <= 0) {
                    killEnemy(enemy);
                } else {
                    // 波の進行方向へ強いノックバック
                    enemy.x += Math.cos(w.angle) * 80;
                    enemy.y += Math.sin(w.angle) * 80;
                    enemy.stunTimer = 500;
                }
            }
        });
    });

    // 弾と敵の当たり判定
    let hitDataThisFrame = new Map();
    projectiles.forEach(p => {
        enemies.forEach(enemy => {
            if (enemy.markedForDeletion || p.markedForDeletion || p.hitEnemies.has(enemy)) return;
            if (checkCollision(p, enemy)) {
                p.hitEnemies.add(enemy);
                enemy.hp -= p.power;

                if (enemy.hp <= 0) {
                    killEnemy(enemy);
                } else {
                    if (!hitDataThisFrame.has(enemy)) {
                        hitDataThisFrame.set(enemy, { count: 0, px: 0, py: 0 });
                    }
                    let data = hitDataThisFrame.get(enemy);
                    data.count++;
                    data.px += p.x;
                    data.py += p.y;
                }
            }
        });
    });

    // まとめてノックバックを適用（多段ヒット時にノックバックで他の弾を避けてしまうのを防ぐため）
    hitDataThisFrame.forEach((data, enemy) => {
        if (enemy.markedForDeletion) return;
        const avgPx = data.px / data.count;
        const avgPy = data.py / data.count;
        const angleToEnemy = Math.atan2(enemy.y - avgPy, enemy.x - avgPx);

        // ヒット数に応じてノックバック距離を少し増やす
        const knockbackDist = 10 + (data.count - 1) * 5;
        enemy.x += Math.cos(angleToEnemy) * knockbackDist;
        enemy.y += Math.sin(angleToEnemy) * knockbackDist;
        enemy.stunTimer = 500;
    });

    enemies.forEach(e => e.update(dt, player));

    // ジェムの回収処理
    gems.forEach(gem => {
        // プレイヤーに引き寄せられる処理（近づいたら吸い込む）
        const dx = player.x - gem.x;
        const dy = player.y - gem.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const pickupRadius = 120; // 経験値を吸い込む半径
        if (distance < pickupRadius) {
            gem.x += (dx / distance) * 450 * (dt / 1000);
            gem.y += (dy / distance) * 450 * (dt / 1000);
        }

        // 回収判定
        if (distance < player.radius + gem.radius) {
            gem.markedForDeletion = true;
            exp += 1.5 * player.expMultiplier;
            updateUI();
            if (exp >= nextLevelExp) {
                triggerLevelUp();
            }
        }
    });

    // ウェーブタイマーと進行
    if (!isGameClear && !isGameOver) {
        if (bossActive) {
            // ボスが倒されたかチェック
            if (!enemies.some(e => e instanceof Boss)) {
                bossActive = false;
                if (currentWave < maxWaves) {
                    currentWave++;
                    waveTimer = waveDuration;
                }
            }
        } else {
            if (currentWave <= maxWaves) {
                waveTimer -= dt;
                if (waveTimer <= 0) {
                    if (currentWave === 5 || currentWave === 10 || currentWave === 15) {
                        spawnBoss(false);
                        bossActive = true;
                        waveTimer = 0;
                    } else if (currentWave === maxWaves) {
                        spawnBoss(true);
                        bossActive = true;
                        waveTimer = 0;
                    } else {
                        currentWave++;
                        waveTimer = waveDuration;
                    }

                    // 次のウェーブで出現間隔を短くする
                    enemySpawnInterval = Math.max(150, enemySpawnInterval - 40);
                }
            }
        }
        updateUI(); // 毎フレーム更新（タイマー表示）
    }

    // 敵のスポーン処理
    enemySpawnTimer += dt;
    if (enemySpawnTimer > enemySpawnInterval && enemies.length < 200) {
        spawnEnemy();
        enemySpawnTimer = 0;
        if (enemySpawnInterval > 200) {
            enemySpawnInterval -= 0.5;
        }
    }

    // ダメージ判定とゲームオーバー判定
    for (let i = 0; i < enemies.length; i++) {
        if (checkCollision(enemies[i], player) && player.invincibleTimer <= 0) {
            player.hp -= enemies[i].attackPower; // 敵の攻撃力分ダメージ
            enemies[i].applyHitEffect(player); // 追加効果の適用

            player.invincibleTimer = 1000; // 1秒間無敵になる

            if (player.hp <= 0) {
                isGameOver = true;
            }
        }
    }

    // 岩や木箱との当たり判定（プレイヤーを押し出す・矩形判定）
    rocks.forEach(rock => {
        const hitbox = rock.getHitbox();
        const offsetY = hitbox.offsetY || 0;
        const minX = rock.x - hitbox.w / 2;
        const maxX = rock.x + hitbox.w / 2;
        const minY = rock.y - hitbox.h / 2 + offsetY;
        const maxY = rock.y + hitbox.h / 2 + offsetY;

        const closestX = Math.max(minX, Math.min(player.x, maxX));
        const closestY = Math.max(minY, Math.min(player.y, maxY));

        const dx = player.x - closestX;
        const dy = player.y - closestY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < player.radius * player.radius) {
            if (distanceSq === 0) {
                const distLeft = player.x - minX;
                const distRight = maxX - player.x;
                const distTop = player.y - minY;
                const distBottom = maxY - player.y;
                const min = Math.min(distLeft, distRight, distTop, distBottom);
                if (min === distLeft) player.x = minX - player.radius;
                else if (min === distRight) player.x = maxX + player.radius;
                else if (min === distTop) player.y = minY - player.radius;
                else player.y = maxY + player.radius;
            } else {
                const distance = Math.sqrt(distanceSq);
                const overlap = player.radius - distance;
                player.x += (dx / distance) * overlap;
                player.y += (dy / distance) * overlap;
            }
            // 押し出された後にワールド境界内に収める
            player.x = Math.max(player.radius, Math.min(WORLD_WIDTH - player.radius, player.x));
            player.y = Math.max(player.radius, Math.min(WORLD_HEIGHT - player.radius, player.y));
        }
    });

    // 敵も岩と当たるようにする（敵を押し出す・矩形判定）
    enemies.forEach(enemy => {
        rocks.forEach(rock => {
            const hitbox = rock.getHitbox();
            const offsetY = hitbox.offsetY || 0;
            const minX = rock.x - hitbox.w / 2;
            const maxX = rock.x + hitbox.w / 2;
            const minY = rock.y - hitbox.h / 2 + offsetY;
            const maxY = rock.y + hitbox.h / 2 + offsetY;

            const closestX = Math.max(minX, Math.min(enemy.x, maxX));
            const closestY = Math.max(minY, Math.min(enemy.y, maxY));

            const dx = enemy.x - closestX;
            const dy = enemy.y - closestY;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq < enemy.radius * enemy.radius) {
                if (distanceSq === 0) {
                    const distLeft = enemy.x - minX;
                    const distRight = maxX - enemy.x;
                    const distTop = enemy.y - minY;
                    const distBottom = maxY - enemy.y;
                    const min = Math.min(distLeft, distRight, distTop, distBottom);
                    if (min === distLeft) enemy.x = minX - enemy.radius;
                    else if (min === distRight) enemy.x = maxX + enemy.radius;
                    else if (min === distTop) enemy.y = minY - enemy.radius;
                    else enemy.y = maxY + enemy.radius;
                } else {
                    const distance = Math.sqrt(distanceSq);
                    const overlap = enemy.radius - distance;
                    enemy.x += (dx / distance) * overlap;
                    enemy.y += (dy / distance) * overlap;
                }
            }
        });
    });

    // カメラ更新（プレイヤーを画面中心に、ワールド端でクランプ）
    camera.x = Math.max(0, Math.min(WORLD_WIDTH - viewWidth, player.x - viewWidth / 2));
    camera.y = Math.max(0, Math.min(WORLD_HEIGHT - viewHeight, player.y - viewHeight / 2));


    // 削除フラグが立ったオブジェクトを除外
    gems = gems.filter(g => !g.markedForDeletion);
    enemies = enemies.filter(e => !e.markedForDeletion);
    projectiles = projectiles.filter(p => !p.markedForDeletion);
    agriFields = agriFields.filter(b => !b.markedForDeletion);
    cleanWaves = cleanWaves.filter(w => !w.markedForDeletion);
    lightnings = lightnings.filter(l => !l.markedForDeletion);
}

function draw() {
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    // カメラ変換を適用（以降はワールド座標で描画）
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // 背景画像の描画（全ステージ共通の1枚描画）
    let currentBgImg = bgImg; // fallback
    if (selectedStageName === 'PC部門') currentBgImg = pcBgImg;
    else if (selectedStageName === 'キッチン部門') currentBgImg = kitchenBgImg;
    else if (selectedStageName === '清掃部門') currentBgImg = cleaningBgImg;
    else if (selectedStageName === '農業部門') currentBgImg = agricultureBgImg;

    if (currentBgImg.complete && currentBgImg.naturalWidth !== 0) {
        ctx.drawImage(currentBgImg, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    } else {
        ctx.fillStyle = '#1a1814';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }
    // ゲームオブジェクト（ワールド座標で描画）
    rocks.forEach(r => r.draw(ctx));
    gems.forEach(g => g.draw(ctx));
    agriFields.forEach(b => b.draw(ctx));
    cleanWaves.forEach(w => w.draw(ctx));
    projectiles.forEach(p => p.draw(ctx));
    lightnings.forEach(l => l.draw(ctx));
    enemies.forEach(e => e.draw(ctx));
    player.draw(ctx);

    ctx.restore();
}

function saveAndDisplayRanking(currentScore, listId = 'ranking-list') {
    const rankingListEl = document.getElementById(listId);
    
    // 部門（ステージ）ごとにキーを分ける
    const storageKey = 'emportSurvivorRankings_' + selectedStageName;
    const oldKey = 'neonSurvivorRankings_' + selectedStageName;
    let rankings = JSON.parse(localStorage.getItem(storageKey)) || JSON.parse(localStorage.getItem(oldKey)) || [];

    const newEntry = { score: currentScore, timestamp: Date.now() };
    rankings.push(newEntry);

    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 5); // トップ5

    localStorage.setItem(storageKey, JSON.stringify(rankings));

    // ランキングのタイトル表示を部門名入りに更新
    const titleEl = listId === 'ranking-list' 
        ? document.getElementById('ranking-title') 
        : document.getElementById('clear-ranking-title');
    if (titleEl) {
        titleEl.innerText = `Top 5 [${selectedStageName}]`;
    }

    rankingListEl.innerHTML = '';
    rankings.forEach((entry, index) => {
        const li = document.createElement('li');

        if (entry.timestamp === newEntry.timestamp) {
            li.style.color = '#00ff00'; // 最新のスコアを強調
            li.style.textShadow = '0 0 10px #00ff00';
        } else {
            li.style.color = '#ffffff';
        }

        li.innerHTML = `<span class="rank-number">${index + 1}.</span><span class="rank-score">${entry.score}</span>`;
        rankingListEl.appendChild(li);
    });
}

function gameLoop(currentTime) {
    if (isGameOver) {
        isGameStarted = false;
        if (mobileControls) mobileControls.classList.add('hidden');
        if (mobileMenuBtn) mobileMenuBtn.classList.add('hidden');
        finalScoreDisplay.innerText = score;
        saveAndDisplayRanking(score, 'ranking-list');
        gameOverScreen.classList.remove('hidden');
        return;
    }

    if (isGameClear) {
        isGameStarted = false;
        if (mobileControls) mobileControls.classList.add('hidden');
        if (mobileMenuBtn) mobileMenuBtn.classList.add('hidden');
        clearScoreDisplay.innerText = score;
        saveAndDisplayRanking(score, 'clear-ranking-list');
        gameClearScreen.classList.remove('hidden');
        return;
    }

    if (isPaused) {
        return; // 一時停止中はループを止める
    }

    const dt = currentTime - lastTime;
    lastTime = currentTime;

    update(dt, currentTime);
    draw();

    // isPausedがtrueになった直後はrequestAnimationFrameを呼ばない
    if (!isPaused) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// ポーズ画面・ゲームオーバー画面の初期非表示（リロード時にも確実に隠す）
pauseScreen.classList.add('hidden');
gameOverScreen.classList.add('hidden');
gameClearScreen.classList.add('hidden');
levelUpScreen.classList.add('hidden');

// 背景の初期描画（ゲーム開始前）
ctx.fillStyle = '#0b0c10';
ctx.fillRect(0, 0, canvas.width, canvas.height);

restartBtn.addEventListener('click', init);

const stageSelectContainer = document.getElementById('stage-select-container');
const characterSelectContainer = document.getElementById('character-select-container');
const backToStageBtn = document.getElementById('back-to-stage-btn');

backToStageBtn.addEventListener('click', () => {
    characterSelectContainer.classList.add('hidden');
    stageSelectContainer.classList.remove('hidden');
});

stageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        selectedStageName = e.target.getAttribute('data-stage');
        stageSelectContainer.classList.add('hidden');
        characterSelectContainer.classList.remove('hidden');
    });
});

const charOptions = document.querySelectorAll('.char-option');
charOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        selectedCharacter = e.currentTarget.getAttribute('data-char');
        startScreen.classList.add('hidden');
        try {
            init();
        } catch (error) {
            alert("エラーが発生しました: " + error.message);
            console.error(error);
        }
    });
});
resumeBtn.addEventListener('click', togglePause);
titleBtn.addEventListener('click', goToTitle);
gameoverTitleBtn.addEventListener('click', goToTitle);
clearTitleBtn.addEventListener('click', goToTitle);
clearRestartBtn.addEventListener('click', init);

// モバイル用 PAUSE ボタンのイベント（直接ポーズ画面を開く/閉じる）
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', togglePause);
}

function resetRankings() {
    if (confirm(`${selectedStageName}のハイスコア（ランキングデータ）を本当にリセットしますか？この操作は取り消せません。`)) {
        // 選択された部門の過去のランキングデータを消去し、現在のプレイ直後のスコアのみを登録する
        const storageKey = 'emportSurvivorRankings_' + selectedStageName;
        const oldKey = 'neonSurvivorRankings_' + selectedStageName;
        const timestamp = Date.now();
        const rankings = [{ score: score, timestamp: timestamp }];
        localStorage.setItem(storageKey, JSON.stringify(rankings));
        localStorage.removeItem(oldKey);
        
        const updateList = (listId) => {
            const listEl = document.getElementById(listId);
            if (listEl) {
                listEl.innerHTML = '';
                const li = document.createElement('li');
                li.style.color = '#00ff00'; // 最新のスコアを強調
                li.style.textShadow = '0 0 10px #00ff00';
                li.innerHTML = `<span class="rank-number">1.</span><span class="rank-score">${score}</span>`;
                listEl.appendChild(li);
            }
        };
        
        updateList('ranking-list');
        updateList('clear-ranking-list');
    }
}

document.getElementById('reset-ranking-btn').addEventListener('click', resetRankings);
document.getElementById('clear-reset-ranking-btn').addEventListener('click', resetRankings);
