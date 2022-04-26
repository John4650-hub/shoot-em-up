const ALPHA = 0.8;
const SCALE_NUM = 1.05;
const SCALE_SPRITE = 0.5
class firstScene extends Phaser.Scene {
  constructor() {
    super({ key: 'firstScene' });
  }
  preload() {

  }
  create() {

  }
}
class InstructionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'instructionScene' });
  }
  preload() {

  }
  create() {

  }
}
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'mainScene' });
    this.bullets;
    this.shot;
  }
  preload() {
    this.load.audio('laser', './assets/sfx_laser1.ogg');
    this.load.plugin('rexvirtualjoystickplugin', './plugins/rexvirtualjoystickplugin.min.js');
    this.load.image('bgSpace', './assets/deep-space.jpg');
    this.load.image('bullets', './assets/dotRed.png');
    this.load.image('missile', './assets/laserGreen04.png');
    this.load.image('p1', './assets/spaceShip4.png');
    this.load.image('Enemymissile', './assets/laserGreen04.png');
    this.load.image('enemy', './assets/spaceShips_005.png');
    this.load.image('effect1', './assets/spaceEffects_008.png');
    this.load.image('effect2', './assets/spaceEffects_010.png');
    this.load.image('base', './assets/stick_bg_line.png');
    this.load.image('thumb', './assets/stick_line.png');
    this.load.image('xKey', './assets/cross.png');
    this.load.image('yKey', './assets/triangle.png');
    this.load.image('aKey', './assets/circle.png');
    this.load.image('bKey', './assets/square.png');
    this.load.image('round', './assets/round_line.png');
    this.load.image('recta', './assets/rect_line.png');
    this.load.image('start', './assets/start.png');
    this.load.image('fscreen', './assets/fullscreen.png');
    this.load.spritesheet('rock','./assets/Asteroid-PNG-File.png',{frameWidth:510/6,frameHeight:500/5})
  }

  create() {
    let lsound = this.sound.add('laser')
    this.input.addPointer(3); //ADD POINTERS TO SUPPORT MULTIPLE INPUT

    this.backG = this.add.tileSprite(0, 0, 800, 1000, 'bgSpace').setOrigin(0).setScrollFactor(1, 0); //ADD BACKGROUND AS A TILE_SPRITE SET IT'S ORIGIN BOTH X AND Y AT 0 AND ALSO SET THE SCROLL_FACTOR FOR X TO 1 MEANING IT SHOULD SCROLL WHILE Y TO 0 MEANING NOT SCROLL

    this.player = this.physics.add.sprite(config.width/2, config.height/2, 'p1').setOrigin(0).setScale(SCALE_SPRITE).setScrollFactor(0); //ADD PLAYER SPRITE TO THE ARCADE PHYSICS AND SET IT'S ORIGIN TO, SIZE 70% OF IT'S SIZE AND SHOULD NOT SCROLL
     this.anims.create({
       key: 'roll',
       frames: this.anims.generateFrameNumbers('rock', { start: 0, end: 29 }),
       repeat: -1,
       frameRate: 32
     })
     let rck =  this.physics.add.sprite(200,100,'ms1').setScale(.5).play('roll')
    this.enemyShips = this.physics.add.group(); //ADD A GROUP FOR MANAGING ALL THE ENEMY SPACESHIPS

    this.physics.add.overlap(this.player, this.enemyShips); //ADD AN OVERLAP TO CALL WHEN ENEMY SPACESHIP PASSES OVER THE PLAYER'S SHIP

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        let x = Phaser.Math.Between(50, 600);
        let y = Phaser.Math.Between(-200, -100);
        let enemy = this.enemyShips.create(x, y, 'enemy').setScale(SCALE_SPRITE).setVelocityY(400);
      },
      callbackScope: this,
      loop: true
    });

    this.player.body.setCollideWorldBounds(true); //ENABLE COLLISION OF THE THE PLAYER WITH THE WORLD BOUNDS

    let joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, { x: 100, y: 300, radius: 60, dir: '4dir', fixed: true, base: this.add.image(200, 200, 'base').setScale(1).setAlpha(ALPHA), thumb: this.add.image(50, 50, 'thumb').setScale(1).setAlpha(ALPHA) });
    var rect = this.add.rectangle(joyStick.x * 7, joyStick.y * .9, 200, 200, 0xff00ff).setAlpha(0);
    let toggleFs = this.add.image(rect.x + 60, 20, 'fscreen').setScale(1.5).setInteractive();
    toggleFs.on('pointerup', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen()
      }
      this.scale.lockOrientation('landscape')
      this.scale.startFullscreen()
    });
    let posX = [rect.x, rect.x + 50, rect.x - 50]
    let posY = [rect.y - 50, rect.y + 50, rect.y]
    for (let i = 0; i < 2; i++) {
      let x = posX[0];
      let y = posY[i];
      this.add.image(x, y, 'round').setAlpha(ALPHA).setScale(SCALE_NUM / 1.2);
    }
    for (let i = 0; i < 2; i++) {
      let x = posX[i + 1];
      let y = posY[2];
      this.add.image(x, y, 'round').setAlpha(ALPHA).setScale(SCALE_NUM / 1.2);
    }
    let recta = this.add.image(rect.x / 1.65, joyStick.y + 50, 'recta').setAlpha(ALPHA)
    let stText = this.add.image(recta.x, recta.y, 'start').setAlpha(ALPHA).setInteractive();
    let ykey = this.add.image(rect.x, rect.y - 54, 'yKey').setScale(SCALE_NUM).setAlpha(ALPHA).setInteractive()
    let xkey = this.add.image(rect.x, rect.y + 50, 'xKey').setScale(SCALE_NUM).setAlpha(ALPHA).setInteractive()
    let bkey = this.add.image(rect.x - 50, rect.y, 'bKey').setScale(SCALE_NUM).setAlpha(ALPHA).setInteractive()
    let akey = this.add.image(rect.x + 50, rect.y, 'aKey').setScale(SCALE_NUM).setAlpha(ALPHA).setInteractive()
    ykey.on('pointerdown', () => {
      ykey.setScale(1.5)
      // console.log('triangle key pressed')
    });
    xkey.on('pointerdown', () => {
      xkey.setScale(1.5)
      // console.log('x key pressed')
    });
    bkey.on('pointerdown', () => {
      bkey.setScale(1.5)
      // console.log('box key pressed')
    });
    akey.on('pointerdown', () => {
      akey.setScale(1.5)
      // console.log('O key pressed')
    });
    ykey.on('pointerup', () => {
      ykey.setScale(SCALE_NUM)
      // console.log('triangle key relea
    });
    xkey.on('pointerup', () => {
      xkey.setScale(SCALE_NUM)
      //   // console.log('x key released')
    });
    bkey.on('pointerup', () => {
      bkey.setScale(SCALE_NUM)
      // console.log('box key released')
    });
    akey.on('pointerup', () => {
      akey.setScale(SCALE_NUM)
      // console.log('O key released')
    });

    this.shoot = this.add.image(600, 890, 'bullets').setScale(4).setInteractive();
    this.bullets = this.physics.add.group({});
    xkey.on('pointerup', () => {
      this.sound.play('laser')
      let bullet1 = this.bullets.create(this.player.x + 30, this.player.y + 10, 'missile').setScale(.5);
      let bullet2 = this.bullets.create(this.player.x + 80, this.player.y + 9, 'missile').setScale(.5);
      bullet1.setVelocityY(-400).body.updateFromGameObject();
      bullet2.setVelocityY(-400).body.updateFromGameObject();
      this.children.swap(bullet1, this.player);
      this.children.swap(this.player, bullet2);
      this.shot = true;
    });

    this.physics.add.overlap(this.bullets, this.enemyShips, this.destroyShip, null, this);
    this.cursorKeys = joyStick.createCursorKeys();
    this.keyBoard = this.input.keyboard.createCursorKeys()
  }

  destroyShip(bullet, enemyship) {
    enemyship.destroy(true)
    bullet.destroy(true)

  }

  dumpJoyStickState() {
    let joyKeys = this.joyStick.createCursorKeys();
    var s = 'Key down: ';
    for (var name in joyKeys) {
      if (joyKeys[name].isDown) {
        s += `${name} `;
      }
    }
  }

  update() {
    
    this.enemyShips.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const ship = child
      if (ship.y >= 1000) {
        ship.y = Phaser.Math.Between(50, 100)
        ship.body.updateFromGameObject()
      }
    })

    this.backG.tilePositionY -= .5
    if (this.shot == true) {
      this.bullets.children.iterate((child) => {
        this.events.on('update', () => {
          if (child.y < 100) {
            child.destroy()
          }
        })
      });
    }
    this.player.setVelocity(0);
    if (this.cursorKeys.up.isDown || this.keyBoard.up.isDown) {
      this.player.setVelocityY(-300);
      // this.player.anims.play('up', true);
    }
    else if (this.cursorKeys.down.isDown || this.keyBoard.down.isDown) {
      this.player.setVelocityY(300);
      // this.player.anims.play('down', true);
      // console.log(this.player.y);

    }
    else if (this.cursorKeys.left.isDown || this.keyBoard.left.isDown) {
      this.player.setVelocityX(-300);
    }
    else if (this.cursorKeys.right.isDown || this.keyBoard.right.isDown) {
      this.player.setVelocityX(300);
      // this.player.anims.play('right', true);
    }
  }

}


class winScene extends Phaser.Scene {
  constructor() {
    super({ key: 'winScene' });
  }
  preload() {

  }
  create() {

  }
}
class lostScene extends Phaser.Scene {
  constructor() {
    super({ key: 'lostScene' });
  }
  preload() {

  }
  create() {

  }
}

let config = {
  type: Phaser.WEBGL,
  parent: 'spaceWindow',
  scale: {
    mode: Phaser.Scale.FIT
  },
  width: 800,
  height: 450,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [ /*firstScene, InstructionScene,*/ MainScene /*, winScene, lostScene*/ ]
};

let game = new Phaser.Game(config);
