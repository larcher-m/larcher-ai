# 赛车游戏说明文档

## 游戏概述
这是一个基于HTML5 Canvas的赛车游戏，玩家需要控制赛车躲避障碍物，收集道具，获得高分。

## 游戏控制
- 使用鼠标控制赛车移动
- 赛车会平滑地跟随鼠标位置
- 赛车会自动朝向移动方向

## 游戏元素

### 障碍物
1. 路障（红色）
   - 碰到会损失生命值
   - 有护盾时可以抵挡一次

2. 施工区域（黄色）
   - 碰到会降低灵敏度至20%
   - 减速效果持续2秒
   - 屏幕会显示"减速中"提示

### 道具
1. 护盾（绿色）
   - 持续时间：4秒
   - 可以抵挡一次路障撞击
   - 出现概率：40%

2. 子弹时间（蓝色）
   - 持续时间：5秒
   - 降低所有障碍物速度至40%
   - 出现概率：30%

3. 磁铁（黄色）
   - 持续时间：8秒
   - 自动吸引附近道具和得分球
   - 出现概率：30%

### 得分球
- 收集可获得1000分
- 可以被磁铁吸引
- 每5秒生成一个

## 游戏机制

### 难度提升
1. 30秒后：
   - 障碍物速度提升
   - 可能同时出现2-3个障碍物
   - 障碍物之间保持最小距离

2. 60秒后：
   - 障碍物速度进一步提升
   - 障碍物数量增加
   - 确保至少有一条可通过的路径

### 碰撞检测
- 车辆碰撞体积为实际大小的70%
- 护盾可以抵挡路障撞击
- 施工区域造成减速效果

### 得分系统
- 基础得分：随时间增加
- 得分球：+1000分
- 记录并显示最高分

## 界面元素
- 当前得分
- 最高分
- 当前速度
- 游戏时间
- 道具状态提示
- 减速状态提示

## 游戏结束条件
- 生命值耗尽
- 按ESC键退出

## 技术特点
- 使用HTML5 Canvas绘制
- 平滑的车辆移动控制
- 动态难度调整
- 多种道具效果
- 碰撞检测优化

以下是 "极速赛车：无尽赛道" 的**详细制作列表**，包含玩法设计、技术实现和代码逻辑，分为 8 个核心模块：

### **一、基础框架搭建**

#### 1. 游戏画布初始化

- **玩法**：创建一个宽 800px、高 600px 的 Canvas 画布，背景色设为深灰色（#333），模拟 "夜晚赛道" 氛围。

- 技术实现：
  ```html
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  ```
  ```javascript
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  ```

#### 2. 游戏状态管理

- **玩法**：定义游戏状态机（`state`），包含 `MENU`（菜单）、`PLAYING`（游戏中）、`PAUSED`（暂停）、`GAME_OVER`（结束）四种状态。

- 技术实现：
  ```javascript
  let state = 'MENU';
  let score = 0;
  let highScore = localStorage.getItem('highScore') || 0;
  ```

### **二、赛车控制与动画**

#### 1. 赛车移动

- 玩法：
  - 赛车自动向右行驶，速度随时间加快（初始速度：5px/帧，每10秒增加1px/帧）。
  - 上箭头键加速，下箭头键减速，左右箭头键控制车道切换。

- 技术实现：
  ```javascript
  class Car {
    constructor() {
      this.x = 100;
      this.y = 400;
      this.width = 60;
      this.height = 100;
      this.speed = 5;
      this.lane = 1; // 1:左, 2:中, 3:右
      this.isAccelerating = false;
      this.isBraking = false;
    }
  
    accelerate() {
      this.speed = Math.min(this.speed + 0.5, 15);
    }
  
    brake() {
      this.speed = Math.max(this.speed - 0.5, 3);
    }
  
    changeLane(direction) {
      if (direction === 'left' && this.lane > 1) {
        this.lane--;
      } else if (direction === 'right' && this.lane < 3) {
        this.lane++;
      }
      this.y = 400 + (this.lane - 2) * 50;
    }
  }
  ```

### **三、赛道系统**

#### 1. 无限赛道

- 玩法：
  - 赛道由三车道组成，玩家可以在车道间切换。
  - 赛道背景循环滚动，速度比赛车速度慢，形成视差效果。

- 技术实现：
  ```javascript
  const trackImage = new Image();
  trackImage.src = 'track.png';
  let trackX1 = 0;
  let trackX2 = trackImage.width;
  
  function updateTrack() {
    trackX1 -= car.speed * 0.8;
    trackX2 -= car.speed * 0.8;
    if (trackX1 <= -trackImage.width) trackX1 = trackImage.width;
    if (trackX2 <= -trackImage.width) trackX2 = trackImage.width;
  }
  ```

### **四、障碍物生成与类型**

#### 1. 随机障碍物生成

- 玩法：
  - 每隔1-3秒生成一个障碍物，类型随机（路障、油渍、施工区）。
  - 障碍物生成位置随机（左、中、右三车道）。

- 技术实现：
  ```javascript
  const obstacles = [];
  let obstacleTimer = 0;
  
  function spawnObstacle() {
    const lane = Math.floor(Math.random() * 3) + 1;
    const type = Math.random() < 0.3 ? 'barrier' : 
                Math.random() < 0.6 ? 'oil' : 'construction';
    const x = 800;
    const y = 400 + (lane - 2) * 50;
    obstacles.push({
      x, y, width: 50, height: 50,
      type, speed: car.speed
    });
  }
  ```

#### 2. 障碍物类型设计

- 路障（barrier）：
  - 宽度50px，高度50px，需要切换车道避开。
  - 碰撞区域：矩形（x±25px, y±25px）。

- 油渍（oil）：
  - 宽度80px，高度30px，经过时速度降低。
  - 效果区域：矩形（x±40px, y±15px）。

- 施工区（construction）：
  - 宽度100px，高度50px，需要减速通过。
  - 碰撞区域：矩形（x±50px, y±25px）。

### **五、碰撞检测系统**

#### 1. 矩形碰撞检测

- 玩法：
  - 赛车与障碍物发生碰撞时，游戏结束。
  - 特殊处理：油渍和施工区有减速效果。

- 技术实现：
  ```javascript
  function checkCollision(car, obstacle) {
    if (car.x + car.width < obstacle.x ||
        car.x > obstacle.x + obstacle.width ||
        car.y + car.height < obstacle.y ||
        car.y > obstacle.y + obstacle.height) {
      return false;
    }
    
    if (obstacle.type === 'oil') {
      car.speed *= 0.8;
      return false;
    }
    if (obstacle.type === 'construction') {
      car.speed *= 0.5;
      return false;
    }
    return true;
  }
  ```

### **六、道具系统**

#### 1. 随机道具生成

- 玩法：
  - 每隔5-10秒生成一个道具，类型随机（氮气加速、护盾、磁铁）。
  - 道具持续时间：10秒。

- 技术实现：
  ```javascript
  const powerUps = [];
  
  function spawnPowerUp() {
    const lane = Math.floor(Math.random() * 3) + 1;
    const x = 800;
    const y = 400 + (lane - 2) * 50;
    const type = Math.random() < 0.3 ? 'nitro' : 
                Math.random() < 0.6 ? 'shield' : 'magnet';
    powerUps.push({
      x, y, width: 30, height: 30,
      type, duration: 10000
    });
  }
  ```

### **七、得分与UI系统**

#### 1. 得分机制

- 玩法：
  - 每行驶1米得1分，每通过一个障碍物得10分。
  - 收集道具额外得50分。

- 技术实现：
  ```javascript
  function updateScore() {
    score += car.speed / 10;
    obstacles.forEach(obs => {
      if (obs.x < car.x + car.width && !obs.scored) {
        score += 10;
        obs.scored = true;
      }
    });
  }
  ```

#### 2. UI界面绘制

- 玩法：
  - 显示当前得分、最高得分、速度表。
  - 游戏结束时显示 "Retry" 按钮。

- 技术实现：
  ```javascript
  function drawUI() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 30);
    ctx.fillText(`High Score: ${highScore}`, 20, 60);
    ctx.fillText(`Speed: ${Math.floor(car.speed * 10)}km/h`, 20, 90);
  }
  ```

### **八、游戏流程控制**

#### 1. 游戏循环

- 玩法：
  - 使用 `requestAnimationFrame` 实现60帧/秒的游戏循环。
  - 循环中依次更新赛道、赛车、障碍物、道具、得分，并检测碰撞。

- 技术实现：
  ```javascript
  function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
  
    if (state === 'PLAYING') {
      updateTrack();
      updateCar(deltaTime);
      updateObstacles();
      updatePowerUps();
      checkCollisions();
      updateScore();
    }
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawCar();
    drawObstacles();
    drawPowerUps();
    drawUI();
  
    requestAnimationFrame(gameLoop);
  }
  ```

#### 2. 游戏结束处理

- 玩法：
  - 碰撞障碍物时游戏结束。
  - 游戏结束时保存最高得分，显示游戏结果界面。

- 技术实现：
  ```javascript
  function gameOver() {
    state = 'GAME_OVER';
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    ctx.font = '48px Arial';
    ctx.fillText('GAME OVER', 200, 300);
    ctx.fillText(`Final Score: ${score}`, 200, 350);
  }
  ```

  

  

  

  

  

  