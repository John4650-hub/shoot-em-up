const ALPHA = .8;
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
    this.load.plugin('rexvirtualjoystickplugin', '/plugins/rexvirtualjoystickplugin.min.js');
    this.load.image('bgSpace', './assets/deep-space.jpg');
    this.load.image('p1', './assets/spaceShip2.png');
    this.load.image('base', './assets/stick_bg_line.png');
    this.load.image('thumb', './assets/stick_line.png');
    this.load.image('controlBg', './assets/glassPanel.png');
    this.load.image('bullets', './assets/dotRed.png');
    this.load.image('missile', './assets/laserGreen04.png');
    this.load.image('Enemymissile', './assets/laserGreen04.png');
    this.load.image('enemy', './assets/spaceShips_005.png');
    this.load.image('effect1', './assets/spaceEffects_008.png');
    this.load.image('effect2', './assets/spaceEffects_010.png');
    this.load.audio('laser', './assetsu/sfx_laser1.ogg');
  }

  create() {
    this.input.addPointer(3); //ADD POINTERS TO SUPPORT MULTIPLE INPUT

    this.backG = this.add.tileSprite(0, 0, 800, 1000, 'bgSpace').setOrigin(0).setScrollFactor(1, 0); //ADD BACKGROUND AS A TILE_SPRITE SET IT'S ORIGIN BOTH X AND Y AT 0 AND ALSO SET THE SCROLL_FACTOR FOR X TO 1 MEANING IT SHOULD SCROLL WHILE Y TO 0 MEANING NOT SCROLL

    this.player = this.physics.add.sprite(300, 250, 'p1').setOrigin(0).setScale(.7).setScrollFactor(0); //ADD PLAYER SPRITE TO THE ARCADE PHYSICS AND SET IT'S ORIGIN TO, SIZE 70% OF IT'S SIZE AND SHOULD NOT SCROLL

    this.bgC = this.physics.add.image(0, 800, 'controlBg').setOrigin(0).setScale(8, 2).setScrollFactor(0); //ADD A BACKGROUND FOROUR CONTROLS THAT DOESN'T SCROLL AND SCALE IT'S WIDTH X8 IT'S NORMAL WIDTH AND HEIGHT X2 IT'S NORMAL HEIGHT

    this.enemyShips = this.physics.add.group(); //ADD A GROUP FOR MANAGING ALL THE ENEMY SPACESHIPS

    this.physics.add.overlap(this.player, this.enemyShips); //ADD AN OVERLAP TO CALL WHEN ENEMY SPACESHIP PASSES OVER THE PLAYER'S SHIP

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        let x = Phaser.Math.Between(50, 600);
        let y = Phaser.Math.Between(-200, -100);
        let enemy = this.enemyShips.create(x, y, 'enemy').setScale(.5).setVelocityY(400);
      },
      callbackScope: this,
      loop: true
    });

    this.bgC.body.pushable = false;//DISABLE PUSHING OF THE BACKGROUD OF CONTROLS BY ANY GAME_OBJECT

    this.player.body.setCollideWorldBounds(true);//ENABLE COLLISION OF THE THE PLAYER WITH THE WORLD BOUNDS

    this.physics.add.collider(this.bgC, this.player);//ENABLE COLLISION BETWEEN THE BACKGROUND OF CONTROLS AND THE PLAYER

    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(
      this,
      {
        x: this.bgC.x + 100,
        y: this.bgC.y + 80,
        radius: 60,
        dir: '4dir',
        fixed: true,
        base: this.add.image(200, 200, 'base').setScale(1).setAlpha(ALPHA),
        thumb: this.add.image(50, 50, 'thumb').setScale(1).setAlpha(ALPHA)
      }).on('update', this.dumpJoyStickState, this);
    this.playerBody = this.player.body;
    this.shoot = this.add.image(600, 890, 'bullets').setScale(4).setInteractive();
    this.bullets = this.physics.add.group({});
    this.shoot.on('pointerup', () => {
      this.sound.play('laser')
      let bullet1 = this.bullets.create(this.player.x + 30, this.player.y + 10, 'missile').setScale(.5);
      let bullet2 = this.bullets.create(this.player.x + 110, this.player.y + 9, 'missile').setScale(.5);
      bullet1.setVelocityY(-400).body.updateFromGameObject();
      bullet2.setVelocityY(-400).body.updateFromGameObject();
      this.children.swap(this.player, bullet1)
      this.children.swap(this.player, bullet2)
      this.shot = true;
    });
    this.physics.add.overlap(this.bullets, this.enemyShips, this.destroyShip, null, this);
    this.cursorKeys = this.joyStick.createCursorKeys();
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
  type: Phaser.CANVAS,
  parent: 'spaceWindow',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  width: 800,
  height: 1000,
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
