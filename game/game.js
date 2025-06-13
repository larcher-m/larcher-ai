// Game constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 800;
const INITIAL_SPEED = 5;
const SPEED_INCREMENT = 0.1;
const MAX_SPEED = 15;
const POWERUP_SPEED = 3;
const SHIELD_DURATION = 4000; // 护盾持续时间4秒
const NITRO_DURATION = 5000; // 子弹时间持续5秒
const MAGNET_DURATION = 8000; // 磁铁持续8秒
const MAGNET_RANGE = 250; // 增加磁铁吸引范围到250像素
const MAGNET_FORCE = 0.15; // 增加磁铁吸引力
const DIFFICULTY_THRESHOLD = 30000; // 30秒后增加难度
const FINAL_DIFFICULTY_THRESHOLD = 60000; // 60秒后最终难度
const POWERUP_SPAWN_INTERVAL = 5000; // 每5秒生成一个道具
const SCORE_BALL_SPAWN_INTERVAL = 5000; // 每5秒生成一个得分球
const OBSTACLE_SPAWN_INTERVAL = 800; // 障碍物生成间隔
const MIN_OBSTACLE_DISTANCE = 100; // 障碍物之间的最小距离
const OBSTACLE_MULTI_SPAWN_CHANCE = 0.4; // 多障碍物生成概率
const POWERUP_CHANCES = {
    shield: 0.4, // 护盾出现概率40%
    nitro: 0.3,  // 子弹时间出现概率30%
    magnet: 0.3  // 磁铁出现概率30%
};
const LANE_WIDTH = 80;     // 增加车道宽度
const DIFFICULTY_INCREASE_INTERVAL = 10000; // 每10秒增加难度
const SPEED_INCREASE_RATE = 0.5; // 每次增加的速度
const SCORE_BALL_POINTS = 1000; // 每个得分球1000分
const POWERUP_SPEED_MULTIPLIER = 0.4; // 道具下落速度
const NITRO_SPEED_MULTIPLIER = 0.4; // 氮气状态下障碍物速度倍率

// Game state
let state = 'MENU';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let lastTime = 0;
let obstacleTimer = 0;
let powerUpTimer = 0;
let scoreBallTimer = 0; // 得分球计时器
let gameTime = 0; // 游戏时间
let currentSpeed = INITIAL_SPEED; // 当前游戏速度

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const startButton = document.getElementById('startButton');

// Game assets
const ASSETS = {
    car: null,
    obstacles: {
        barrier: null,
        construction: null
    },
    track: null,
    powerups: {
        nitro: null,
        shield: null,
        magnet: null
    },
    scoreBall: null // 得分球图片
};

// Load game assets
function loadAssets() {
    return new Promise((resolve, reject) => {
        let loadedImages = 0;
        const totalImages = 8; // 增加一个图片

        function checkAllLoaded() {
            loadedImages++;
            if (loadedImages === totalImages) {
                console.log('所有图片加载完成');
                resolve();
            }
        }

        // Load car
        ASSETS.car = new Image();
        ASSETS.car.onload = checkAllLoaded;
        ASSETS.car.onerror = () => console.error('汽车图片加载失败');
        ASSETS.car.src = 'https://s1.aigei.com/src/img/png/c1/c16aab9ed304455eaa5778a8cb1606a6.png?imageMogr2/auto-orient/thumbnail/!42x48r/gravity/Center/crop/42x48/quality/85/%7CimageView2/2/w/42%7Cwatermark/3/image/aHR0cHM6Ly9zMS5haWdlaS5jb20vd2F0ZXJtYXJrL3BpYy0wXzU5LTEtRzUucG5nP2U9MjA1MTAyMDgwMCZ0b2tlbj1QN1MyWHB6ZnoxMXZBa0FTTFRrZkhON0Z3LW9PWkJlY3FlSmF4eXBMOmVNYVBVcUI2WWt0U1lsakRTQTJJUWhXangzST0=/dissolve/100/gravity/Center/dx/1/dy/-2/image/aHR0cHM6Ly9zMS5haWdlaS5jb20vd2F0ZXJtYXJrL3BpYy02MF8xNTAtMS1HNS5wbmc_ZT0yMDUxMDIwODAwJnRva2VuPVA3UzJYcHpmejExdkFrQVNMVGtmSE43Rnctb09aQmVjcWVKYXh5cEw6YXVfaHlwM1cxTTc2ZTFIeFM4MnJNZ0tNTFZjPQ==/dissolve/100/gravity/Center/dx/0/dy/-1&e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:cx8LqEtYkhKxv6f69MzK_V_Khio=';
        
        // 直接设置资源加载完成（使用代码绘制替代图片）
        checkAllLoaded(); // car
        checkAllLoaded(); // barrier
        checkAllLoaded(); // construction  
        checkAllLoaded(); // track
        checkAllLoaded(); // nitro
        checkAllLoaded(); // shield
        checkAllLoaded(); // magnet
        checkAllLoaded(); // score ball
    });
}

// Car class
class Car {
    constructor() {
        this.width = 40;
        this.height = 30;
        this.collisionWidth = this.width;
        this.collisionHeight = this.height;
        this.x = CANVAS_WIDTH / 2; // 在道路中央
        this.y = CANVAS_HEIGHT - 100;
        this.speed = 5;
        this.moveSpeed = 0.25;
        this.baseMoveSpeed = 0.25;
        this.targetX = this.x;
        this.targetY = this.y;
        this.isInvincible = false;
        this.hasNitro = false;
        this.hasMagnet = false;
        this.shieldTimer = null;
        this.nitroTimer = null;
        this.magnetTimer = null;
        this.slowTimer = null;
        this.isSlowed = false; // 添加减速状态标记
    }

    update() {
        // 更新位置
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
            this.x += dx * this.moveSpeed;
            this.y += dy * this.moveSpeed;
        }
    }

    // 添加减速效果
    slowDown() {
        // 如果已经在减速状态，重置计时器
        if (this.slowTimer) {
            clearTimeout(this.slowTimer);
        }
        
        // 降低移动速度到20%
        this.moveSpeed = this.baseMoveSpeed * 0.2;
        this.isSlowed = true;
        
        // 设置计时器恢复速度
        this.slowTimer = setTimeout(() => {
            this.moveSpeed = this.baseMoveSpeed;
            this.isSlowed = false;
            this.slowTimer = null;
        }, 2000); // 持续2秒
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 计算移动方向的角度
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const angle = Math.atan2(dy, dx);
        ctx.rotate(angle);
        
        // 绘制车辆
        ctx.drawImage(
            ASSETS.car,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        
        // 绘制护盾效果（使用实际尺寸）
        if (this.isInvincible) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width/2 + 5, this.height/2 + 5, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// Obstacle class
class Obstacle {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.baseSpeed = currentSpeed; // 保存基础速度
        this.speed = currentSpeed;
        this.scored = false;
    }

    update() {
        // 根据氮气状态调整速度
        this.speed = car.hasNitro ? this.baseSpeed * NITRO_SPEED_MULTIPLIER : this.baseSpeed;
        this.y += this.speed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.type === 'barrier') {
            // 绘制红色细三角障碍物
            ctx.fillStyle = '#ff2222';
            ctx.beginPath();
            ctx.moveTo(0, -this.height/2);
            ctx.lineTo(-this.width/3, this.height/2);
            ctx.lineTo(this.width/3, this.height/2);
            ctx.closePath();
            ctx.fill();
            
            // 添加白色条纹
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-this.width/6, 0);
            ctx.lineTo(this.width/6, 0);
            ctx.moveTo(-this.width/8, this.height/4);
            ctx.lineTo(this.width/8, this.height/4);
            ctx.stroke();
            
            // 边框
            ctx.strokeStyle = '#cc0000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -this.height/2);
            ctx.lineTo(-this.width/3, this.height/2);
            ctx.lineTo(this.width/3, this.height/2);
            ctx.closePath();
            ctx.stroke();
        } else if (this.type === 'construction') {
            // 绘制香蕉皮
            ctx.fillStyle = '#ffff00';
            // 香蕉皮主体
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width/2, this.height/3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 香蕉皮瓣
            ctx.fillStyle = '#ffdd00';
            ctx.beginPath();
            ctx.ellipse(-this.width/4, -this.height/4, this.width/6, this.height/4, -0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.width/4, -this.height/4, this.width/6, this.height/4, 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(-this.width/6, this.height/4, this.width/8, this.height/5, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.width/6, this.height/4, this.width/8, this.height/5, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // 香蕉皮斑点
            ctx.fillStyle = '#cc9900';
            ctx.beginPath();
            ctx.ellipse(-this.width/8, 0, 2, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.width/8, this.height/8, 2, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// PowerUp class
class PowerUp {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.speed = POWERUP_SPEED; // 使用较慢的道具速度
        this.scored = false;
        this.targetX = x;
    }

    update() {
        this.y += this.speed;
        
        // 如果玩家有磁铁，计算吸引力
        if (car.hasMagnet) {
            const dx = car.x - this.x;
            const dy = car.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < MAGNET_RANGE) {
                // 计算吸引力
                const force = MAGNET_FORCE * (1 - distance / MAGNET_RANGE);
                this.targetX = car.x;
                // 平滑移动到目标位置
                this.x += (this.targetX - this.x) * force;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.type === 'shield') {
            // 绘制更像护盾的形状
            ctx.fillStyle = '#0088ff';
            // 护盾外形 - 盾牌形状
            ctx.beginPath();
            ctx.moveTo(0, -this.height/2);
            ctx.quadraticCurveTo(-this.width/2, -this.height/3, -this.width/2, 0);
            ctx.quadraticCurveTo(-this.width/2, this.height/3, 0, this.height/2);
            ctx.quadraticCurveTo(this.width/2, this.height/3, this.width/2, 0);
            ctx.quadraticCurveTo(this.width/2, -this.height/3, 0, -this.height/2);
            ctx.fill();
            
            // 护盾边框
            ctx.strokeStyle = '#0066cc';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 护盾内部装饰
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -this.height/3);
            ctx.lineTo(0, this.height/3);
            ctx.moveTo(-this.width/4, -this.height/6);
            ctx.lineTo(this.width/4, -this.height/6);
            ctx.stroke();
        } else if (this.type === 'nitro') {
            // 绘制箭头形状的氮气加速
            ctx.fillStyle = '#00ff44';
            // 箭头主体
            ctx.beginPath();
            ctx.moveTo(0, -this.height/2);
            ctx.lineTo(-this.width/3, -this.height/6);
            ctx.lineTo(-this.width/6, -this.height/6);
            ctx.lineTo(-this.width/6, this.height/2);
            ctx.lineTo(this.width/6, this.height/2);
            ctx.lineTo(this.width/6, -this.height/6);
            ctx.lineTo(this.width/3, -this.height/6);
            ctx.closePath();
            ctx.fill();
            
            // 箭头边框
            ctx.strokeStyle = '#00cc22';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 箭头内部高光
            ctx.fillStyle = '#88ff88';
            ctx.beginPath();
            ctx.moveTo(0, -this.height/3);
            ctx.lineTo(-this.width/6, 0);
            ctx.lineTo(-this.width/12, 0);
            ctx.lineTo(-this.width/12, this.height/3);
            ctx.lineTo(this.width/12, this.height/3);
            ctx.lineTo(this.width/12, 0);
            ctx.lineTo(this.width/6, 0);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'magnet') {
            // 绘制更像磁铁的U形磁铁
            ctx.fillStyle = '#ff2244';
            // U形磁铁主体
            ctx.beginPath();
            ctx.moveTo(-this.width/2, -this.height/2);
            ctx.lineTo(-this.width/2, this.height/3);
            ctx.lineTo(-this.width/4, this.height/3);
            ctx.lineTo(-this.width/4, -this.height/3);
            ctx.lineTo(this.width/4, -this.height/3);
            ctx.lineTo(this.width/4, this.height/3);
            ctx.lineTo(this.width/2, this.height/3);
            ctx.lineTo(this.width/2, -this.height/2);
            ctx.closePath();
            ctx.fill();
            
            // 磁铁两极
            ctx.fillStyle = '#0066ff';
            ctx.fillRect(-this.width/2, this.height/3, this.width/4, this.height/6);
            ctx.fillRect(this.width/4, this.height/3, this.width/4, this.height/6);
            
            // 标记N和S
            ctx.fillStyle = '#ffffff';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('N', -this.width/3, this.height/2);
            ctx.fillText('S', this.width/3, this.height/2);
            
            // 磁力线效果
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(-this.width/3, 0, this.width/8, 0, Math.PI);
            ctx.arc(this.width/3, 0, this.width/8, 0, Math.PI);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// ScoreBall class
class ScoreBall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = POWERUP_SPEED; // 使用较慢的道具速度
        this.scored = false;
        this.targetX = x;
        this.rotation = 0;
        this.rotationSpeed = 0.1;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        
        // 如果玩家有磁铁，计算吸引力
        if (car.hasMagnet) {
            const dx = car.x - this.x;
            const dy = car.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < MAGNET_RANGE) {
                // 计算吸引力
                const force = MAGNET_FORCE * (1 - distance / MAGNET_RANGE);
                this.targetX = car.x;
                // 平滑移动到目标位置
                this.x += (this.targetX - this.x) * force;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // 绘制金色得分球
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.7, '#ffcc00');
        gradient.addColorStop(1, '#ff8800');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#cc6600';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 添加星星符号
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('★', 0, 3);
        
        ctx.restore();
    }
}

// Game objects
const car = new Car();
const obstacles = [];
const powerUps = [];
const scoreBalls = []; // 得分球数组

// Event listeners
document.addEventListener('keydown', (e) => {
    if (state !== 'PLAYING') return;
    
    switch(e.code) {
        case 'ArrowUp':
            car.isAccelerating = true;
            break;
        case 'ArrowDown':
            car.isBraking = true;
            break;
        case 'ArrowLeft':
            car.changeLane('left');
            break;
        case 'ArrowRight':
            car.changeLane('right');
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (state !== 'PLAYING') return;
    
    switch(e.code) {
        case 'ArrowUp':
            car.isAccelerating = false;
            break;
        case 'ArrowDown':
            car.isBraking = false;
            break;
    }
});

startButton.addEventListener('click', async () => {
    try {
        await loadAssets();
        state = 'PLAYING';
        menu.style.display = 'none';
        resetGame();
    } catch (error) {
        console.error('游戏资源加载失败:', error);
        alert('游戏资源加载失败，请刷新页面重试');
    }
});

// Mouse control
canvas.addEventListener('mousemove', (e) => {
    if (state === 'PLAYING') {
        const rect = canvas.getBoundingClientRect();
        // 限制小车在道路范围内移动
        car.targetX = Math.max(70 + car.width/2, Math.min(CANVAS_WIDTH - 70 - car.width/2, e.clientX - rect.left));
        car.targetY = Math.max(car.height/2, Math.min(CANVAS_HEIGHT - car.height/2, e.clientY - rect.top));
    }
});

// Touch control for mobile
canvas.addEventListener('touchmove', (e) => {
    if (state === 'PLAYING') {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        // 限制小车在道路范围内移动
        car.targetX = Math.max(70 + car.width/2, Math.min(CANVAS_WIDTH - 70 - car.width/2, e.touches[0].clientX - rect.left));
        car.targetY = Math.max(car.height/2, Math.min(CANVAS_HEIGHT - car.height/2, e.touches[0].clientY - rect.top));
    }
}, { passive: false });

// 修改点击事件处理
canvas.addEventListener('click', function(event) {
    if (state === 'GAME_OVER') {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 检查是否点击了重新开始按钮
        if (x >= CANVAS_WIDTH/2 - 100 && x <= CANVAS_WIDTH/2 + 100 &&
            y >= CANVAS_HEIGHT/2 + 80 && y <= CANVAS_HEIGHT/2 + 130) {
            resetGame();
            state = 'PLAYING';
            menu.style.display = 'none';
        }
    }
});

// Game functions
function spawnObstacle() {
    // 30秒后可能同时生成多个障碍物
    if (gameTime >= DIFFICULTY_THRESHOLD) {
        const obstacleCount = Math.random() < 0.3 ? 3 : // 30%概率生成3个
                            Math.random() < 0.6 ? 2 : 1; // 30%概率生成2个，40%概率生成1个
        
        for (let i = 0; i < obstacleCount; i++) {
            // 确保障碍物不会重叠，并且在道路范围内
            let x;
            let attempts = 0;
            do {
                x = Math.random() * (CANVAS_WIDTH - 140 - 60) + 70 + 30; // 在道路范围内生成
                attempts++;
            } while (attempts < 10 && obstacles.some(obs => 
                Math.abs(obs.x - x) < 40 && obs.y > -100 && obs.y < 100
            ));
            
            const type = Math.random() < 0.6 ? 'barrier' : 'construction';
            obstacles.push(new Obstacle(type, x, -50 - i * 30)); // 错开生成位置
        }
    } else {
        // 30秒前正常生成单个障碍物
        const x = Math.random() * (CANVAS_WIDTH - 140 - 60) + 70 + 30; // 在道路范围内生成
        const type = Math.random() < 0.6 ? 'barrier' : 'construction';
        obstacles.push(new Obstacle(type, x, -50));
    }
}

function spawnPowerUp() {
    const x = Math.random() * (CANVAS_WIDTH - 140 - 50) + 70 + 25; // 在道路范围内生成
    // 调整道具出现概率，提高护盾出现频率
    const rand = Math.random();
    const type = rand < 0.4 ? 'shield' : // 40%概率出现护盾
                rand < 0.7 ? 'nitro' :   // 30%概率出现氮气
                'magnet';                // 30%概率出现磁铁
    powerUps.push(new PowerUp(type, x, -50));
}

function spawnScoreBall() {
    const x = Math.random() * (CANVAS_WIDTH - 140 - 40) + 70 + 20; // 在道路范围内生成
    scoreBalls.push(new ScoreBall(x, -50));
}

function checkCollision(car, obstacle) {
    // 如果是道具或得分球，直接进行碰撞检测
    if (obstacle.type === 'powerup' || obstacle instanceof ScoreBall) {
        if (car.x + car.width/2 < obstacle.x - obstacle.width/2 ||
            car.x - car.width/2 > obstacle.x + obstacle.width/2 ||
            car.y + car.height/2 < obstacle.y - obstacle.height/2 ||
            car.y - car.height/2 > obstacle.y + obstacle.height/2) {
            return false;
        }
        return true;
    }
    
    // 对于障碍物，检查护盾状态
    if (car.isInvincible && (obstacle.type === 'barrier' || obstacle.type === 'construction')) {
        return false;
    }
    
    // 普通碰撞检测
    if (car.x + car.width/2 < obstacle.x - obstacle.width/2 ||
        car.x - car.width/2 > obstacle.x + obstacle.width/2 ||
        car.y + car.height/2 < obstacle.y - obstacle.height/2 ||
        car.y - car.height/2 > obstacle.y + obstacle.height/2) {
        return false;
    }
    
    if (obstacle.type === 'construction') {
        car.slowDown(); // 使用新的减速效果
        return false;
    }
    return true;
}

function activatePowerUp(type) {
    switch(type) {
        case 'nitro':
            // 如果已经有氮气效果，重置计时器
            if (car.hasNitro && car.nitroTimer) {
                clearTimeout(car.nitroTimer);
            }
            car.hasNitro = true;
            // 更新所有障碍物的速度
            obstacles.forEach(obs => {
                obs.speed = obs.baseSpeed * NITRO_SPEED_MULTIPLIER;
            });
            car.nitroTimer = setTimeout(() => {
                car.hasNitro = false;
                // 恢复所有障碍物的速度
                obstacles.forEach(obs => {
                    obs.speed = obs.baseSpeed;
                });
                car.nitroTimer = null;
            }, 5000);
            break;
        case 'shield':
            // 如果已经有护盾效果，重置计时器
            if (car.isInvincible && car.shieldTimer) {
                clearTimeout(car.shieldTimer);
            }
            car.isInvincible = true;
            car.shieldTimer = setTimeout(() => {
                car.isInvincible = false;
                car.shieldTimer = null;
            }, SHIELD_DURATION);
            break;
        case 'magnet':
            // 如果已经有磁铁效果，重置计时器
            if (car.hasMagnet && car.magnetTimer) {
                clearTimeout(car.magnetTimer);
            }
            car.hasMagnet = true;
            car.magnetTimer = setTimeout(() => {
                car.hasMagnet = false;
                car.magnetTimer = null;
            }, 5000);
            break;
    }
}

function updateScore() {
    score += car.speed / 10;
    obstacles.forEach(obs => {
        if (obs.y > car.y && !obs.scored) {
            score += 10;
            obs.scored = true;
        }
    });
    // 检查道具碰撞
    powerUps.forEach((pu, index) => {
        if (checkCollision(car, pu)) {
            score += 50;
            activatePowerUp(pu.type);
            powerUps.splice(index, 1); // 立即移除道具
        }
    });
    // 检查得分球碰撞
    scoreBalls.forEach((ball, index) => {
        if (checkCollision(car, ball)) {
            score += SCORE_BALL_POINTS;
            scoreBalls.splice(index, 1);
            // 显示得分动画
            showScoreAnimation(ball.x, ball.y, SCORE_BALL_POINTS);
        }
    });
}

// 显示得分动画
function showScoreAnimation(x, y, points) {
    const scoreText = document.createElement('div');
    scoreText.textContent = `+${points}`;
    scoreText.style.position = 'absolute';
    scoreText.style.left = x + 'px';
    scoreText.style.top = y + 'px';
    scoreText.style.color = '#ffff00';
    scoreText.style.fontSize = '24px';
    scoreText.style.fontWeight = 'bold';
    scoreText.style.textShadow = '0 0 5px #000';
    scoreText.style.transition = 'all 1s';
    scoreText.style.opacity = '1';
    scoreText.style.transform = 'translateY(0)';
    document.querySelector('.game-container').appendChild(scoreText);

    // 动画效果
    setTimeout(() => {
        scoreText.style.opacity = '0';
        scoreText.style.transform = 'translateY(-50px)';
        setTimeout(() => scoreText.remove(), 1000);
    }, 0);
}

function drawUI() {
    ctx.font = '24px "Microsoft YaHei"';
    ctx.fillStyle = '#fff';
    ctx.fillText(`得分: ${Math.floor(score)}`, 20, 30);
    ctx.fillText(`最高分: ${highScore}`, 20, 60);
    ctx.fillText(`速度: ${Math.floor(currentSpeed * 10)}km/h`, 20, 90);
    ctx.fillText(`时间: ${Math.floor(gameTime/1000)}秒`, 20, 120);
    
    // 显示当前激活的道具
    if (car.hasNitro) {
        ctx.fillStyle = '#00ffff';
        ctx.fillText('子弹时间', 20, 150);
    }
    if (car.isInvincible) {
        ctx.fillStyle = '#00ff00';
        ctx.fillText('护盾', 20, 180);
    }
    if (car.hasMagnet) {
        ctx.fillStyle = '#ffff00';
        ctx.fillText('磁铁', 20, 210);
    }
    // 显示减速提示
    if (car.isSlowed) {
        ctx.fillStyle = '#ff0000';
        ctx.fillText('减速中', 20, 240);
    }
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.font = 'bold 36px "Microsoft YaHei"';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    
    // 显示游戏结束
    ctx.fillText('游戏结束', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 60);
    
    // 显示最终得分
    ctx.font = '28px "Microsoft YaHei"';
    ctx.fillText(`最终得分: ${Math.floor(score)}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    
    // 显示最高分
    ctx.fillText(`最高分: ${highScore}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 40);
    
    // 显示重新开始按钮
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(CANVAS_WIDTH/2 - 100, CANVAS_HEIGHT/2 + 80, 200, 50);
    ctx.fillStyle = '#fff';
    ctx.font = '24px "Microsoft YaHei"';
    ctx.fillText('重新开始', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 115);
    
    ctx.textAlign = 'left';
}

function gameOver() {
    state = 'GAME_OVER';
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
    // 隐藏开始菜单
    menu.style.display = 'none';
    
    // 显示游戏结束界面
    drawGameOver();
}

function resetGame() {
    car.x = CANVAS_WIDTH / 2; // 保持在道路中央
    car.y = CANVAS_HEIGHT - 100;
    car.targetX = car.x;
    car.targetY = car.y;
    car.moveSpeed = car.baseMoveSpeed; // 重置移动速度
    if (car.slowTimer) {
        clearTimeout(car.slowTimer);
        car.slowTimer = null;
    }
    currentSpeed = INITIAL_SPEED;
    car.isInvincible = false;
    car.hasNitro = false;
    car.hasMagnet = false;
    // 清除所有道具计时器
    if (car.shieldTimer) {
        clearTimeout(car.shieldTimer);
        car.shieldTimer = null;
    }
    if (car.nitroTimer) {
        clearTimeout(car.nitroTimer);
        car.nitroTimer = null;
    }
    if (car.magnetTimer) {
        clearTimeout(car.magnetTimer);
        car.magnetTimer = null;
    }
    score = 0;
    gameTime = 0;
    obstacles.length = 0;
    powerUps.length = 0;
    scoreBalls.length = 0;
    obstacleTimer = 0;
    powerUpTimer = 0;
    scoreBallTimer = 0;
}

// Game loop
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (state === 'PLAYING') {
        // Update game time
        gameTime += deltaTime;
        
        // Increase difficulty over time
        if (gameTime % DIFFICULTY_INCREASE_INTERVAL < deltaTime) {
            currentSpeed = Math.min(currentSpeed + SPEED_INCREASE_RATE, MAX_SPEED);
            // 更新所有障碍物的基础速度
            obstacles.forEach(obs => {
                obs.baseSpeed = currentSpeed;
                obs.speed = car.hasNitro ? currentSpeed * NITRO_SPEED_MULTIPLIER : currentSpeed;
            });
        }

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw track background
        // 绘制天空渐变背景
        const skyGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // 绘制两边的绿植区域
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 0, 70, CANVAS_HEIGHT);
        ctx.fillRect(CANVAS_WIDTH - 70, 0, 70, CANVAS_HEIGHT);
        
        // 绘制固定位置的绿植装饰
        ctx.fillStyle = '#32CD32';
        // 左侧绿植
        const leftPlants = [
            {x: 15, y: 50}, {x: 45, y: 120}, {x: 25, y: 200}, {x: 55, y: 280},
            {x: 35, y: 360}, {x: 20, y: 440}, {x: 50, y: 520}, {x: 30, y: 600},
            {x: 40, y: 680}, {x: 10, y: 750}
        ];
        leftPlants.forEach(plant => {
            ctx.beginPath();
            ctx.arc(plant.x, plant.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 右侧绿植
        const rightPlants = [
            {x: 340, y: 80}, {x: 370, y: 150}, {x: 350, y: 230}, {x: 380, y: 310},
            {x: 360, y: 390}, {x: 345, y: 470}, {x: 375, y: 550}, {x: 355, y: 630},
            {x: 365, y: 710}, {x: 385, y: 780}
        ];
        rightPlants.forEach(plant => {
            ctx.beginPath();
            ctx.arc(plant.x, plant.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 绘制三车道道路
        ctx.fillStyle = '#333333';
        ctx.fillRect(70, 0, CANVAS_WIDTH - 140, CANVAS_HEIGHT);
        
        // 绘制车道分隔线 - 三车道需要两条分隔线
        const laneWidth = (CANVAS_WIDTH - 140) / 3;
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.setLineDash([15, 15]);
        
        // 第一条分隔线
        ctx.beginPath();
        ctx.moveTo(70 + laneWidth, 0);
        ctx.lineTo(70 + laneWidth, CANVAS_HEIGHT);
        ctx.stroke();
        
        // 第二条分隔线
        ctx.beginPath();
        ctx.moveTo(70 + laneWidth * 2, 0);
        ctx.lineTo(70 + laneWidth * 2, CANVAS_HEIGHT);
        ctx.stroke();
        
        ctx.setLineDash([]);
        
        // 绘制道路边界线
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(70, 0);
        ctx.lineTo(70, CANVAS_HEIGHT);
        ctx.moveTo(CANVAS_WIDTH - 70, 0);
        ctx.lineTo(CANVAS_WIDTH - 70, CANVAS_HEIGHT);
        ctx.stroke();
        
        // 添加固定位置的花朵装饰
        ctx.fillStyle = '#FF69B4';
        const leftFlowers = [
            {x: 30, y: 100}, {x: 50, y: 250}, {x: 20, y: 400}, {x: 40, y: 550}, {x: 25, y: 700}
        ];
        leftFlowers.forEach(flower => {
            // 画小花
            for (let j = 0; j < 5; j++) {
                ctx.save();
                ctx.translate(flower.x, flower.y);
                ctx.rotate((j * Math.PI * 2) / 5);
                ctx.beginPath();
                ctx.ellipse(3, 0, 2, 1, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
        
        const rightFlowers = [
            {x: 355, y: 130}, {x: 375, y: 280}, {x: 345, y: 430}, {x: 365, y: 580}, {x: 380, y: 730}
        ];
        rightFlowers.forEach(flower => {
            // 画小花
            for (let j = 0; j < 5; j++) {
                ctx.save();
                ctx.translate(flower.x, flower.y);
                ctx.rotate((j * Math.PI * 2) / 5);
                ctx.beginPath();
                ctx.ellipse(3, 0, 2, 1, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        // Update game objects
        car.update();
        
        // Spawn obstacles
        obstacleTimer += deltaTime;
        if (obstacleTimer >= OBSTACLE_SPAWN_INTERVAL) {
            spawnObstacle();
            obstacleTimer = 0;
        }
        
        // Spawn power-ups
        powerUpTimer += deltaTime;
        if (powerUpTimer >= 5000) {
            spawnPowerUp();
            powerUpTimer = 0;
        }

        // Spawn score balls
        scoreBallTimer += deltaTime;
        if (scoreBallTimer >= SCORE_BALL_SPAWN_INTERVAL) {
            spawnScoreBall();
            scoreBallTimer = 0;
        }
        
        // Update obstacles
        obstacles.forEach((obs, index) => {
            obs.update();
            if (obs.y > CANVAS_HEIGHT) {
                obstacles.splice(index, 1);
            }
            if (checkCollision(car, obs)) {
                gameOver();
            }
        });
        
        // Update power-ups
        powerUps.forEach((pu, index) => {
            pu.update();
            if (pu.y > CANVAS_HEIGHT) {
                powerUps.splice(index, 1);
            }
        });

        // Update score balls
        scoreBalls.forEach((ball, index) => {
            ball.update();
            if (ball.y > CANVAS_HEIGHT) {
                scoreBalls.splice(index, 1);
            }
        });
        
        // Update score
        updateScore();
        
        // Draw everything
        car.draw();
        obstacles.forEach(obs => obs.draw());
        powerUps.forEach(pu => pu.draw());
        scoreBalls.forEach(ball => ball.draw());
        drawUI();
    }

    requestAnimationFrame(gameLoop);
}

// Initialization
async function initGame() {
    try {
        await loadAssets();
        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error('游戏初始化失败:', error);
        alert('游戏初始化失败，请刷新页面重试');
    }
}

// Start the game
initGame(); 