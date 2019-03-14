var enemy_num = 7;
var end = false;
var mainState = {
  preload: function () {
    // game.load.image('name', 'path/to/filename');
    game.load.image('ground1', 'assets/ground1.png');
    game.load.image('chick', 'assets/chick_stick.png');
    game.load.image('enemies', 'assets/rocket_1.png');
    game.load.image('ground2', 'assets/ground2.png');
    game.load.image('groundAir', 'assets/ground_air.png');

    // game.load.spritesheet('name', 'path/to/filename', width, height)  optional : frame count.
    game.load.spritesheet('player', 'assets/pokemon_1.png', 64, 64);
  },

  create: function () {

    this.score = 0;
    this.scoreText;
    this.endText;

        // text(x, y, text, style);
    this.scoreText = game.add.text(16, 16, 'Score : ' + this.score, {
      fontSize: '20px',
      fill: '#ed3465'
    });

    game.stage.backgroundColor = '#a8e8ff';

    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Add ground out of the world for respawn the rocket
    this.offWorld = game.add.group();
    this.offWorld.enableBody = true;

    this.myWorld = game.add.group();
    this.myWorld.enableBody = true;

    // Create ground for play
    var  ground2 = this.myWorld.create(0, game.world.height - 50, 'ground2');
    ground2.scale.setTo(3, 1.5);
    ground2.body.immovable = true;

    var  ga1 = this.myWorld.create(20, game.world.height - 170, 'groundAir');
    ga1.scale.setTo(0.5, 0.5);
    ga1.body.immovable = true;

    var  ga2 = this.myWorld.create(600, game.world.height - 170, 'groundAir');
    ga2.scale.setTo(0.5, 0.5);
    ga2.body.immovable = true;

    var  ga2 = this.myWorld.create(350, game.world.height - 290, 'groundAir');
    ga2.scale.setTo(0.5, 0.5);
    ga2.body.immovable = true;

    // Group.create(x, y, image);
    var ground1 = this.offWorld.create(0, game.world.height + 100 , 'ground1');
    ground1.scale.setTo(2.5, 2);
    ground1.body.immovable = true;

    // Add player on x = 400, y= 450 (respawn in the middle of the scene)
    // collideWorldBounds = true; means cannot get out of the scene (fixed bug falling through map)
    this.player = game.add.sprite(400, 450, 'player');
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 980;
    this.player.body.collideWorldBounds = true;

    // animations.add(name, frames, frame rate, loop);
    this.player.animations.add('right', [8, 9, 10, 11], 10, true);
    this.player.animations.add('left', [4, 5, 6, 7], 10, true);
    this.player.frame = 2;

    // Add chicken pick up for point
    this.chicken = game.add.group();
    this.chicken.enableBody = true;

    // Add enemy
    this.enemy = game.add.group();
    this.enemy.enableBody = true;
    // Start random spawn coins and spawn the enemy (play function())
    this.spawnChick();
    this.firstspawnEnemy();


    // Set input = this.cursors
    this.cursors = this.input.keyboard.createCursorKeys();

  },

  update: function () {
    // Coin and player can touch the grounds
    game.physics.arcade.collide(this.player, this.myWorld);
    game.physics.arcade.collide(this.chicken, this.myWorld);

    // Check if player overlap chicken
    game.physics.arcade.overlap(this.player, this.enemy, this.end, null, this);
    game.physics.arcade.overlap(this.player, this.chicken, this.collectChick, null, this);
    game.physics.arcade.overlap(this.offWorld, this.enemy, this.enemyHit, null, this);

    // Move right and left else == play animation when stop
    this.player.body.velocity.x = 0;
    if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 300;
      this.player.animations.play('right');
    } else if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -300;
      this.player.animations.play('left');
    } else {
      this.player.animations.stop();
      this.player.frame = 2;
    }

    // // Allow player to jump if player touching the ground.
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -500;
    }

    if (enemy_num < 7){
      this.spawnEnemy();
    }

    if (end == true && this.cursors.down.isDown){
      this.state.start('main');
      end = false;
    }


  },
  
  spawnChick: function() {
      var x = this.rnd.integerInRange(0, game.world.width - 40);
      var y = this.rnd.integerInRange(0, game.world.height - 100);

      this.chicken.create(x, y, 'chick');
      this.chicken.forEach(function(chick) {
        game.physics.arcade.enable(chick);
        chick.scale.setTo(0.15, 0.15);
        chick.body.gravity.y = 200;
      });
    
  },

  collectChick: function(player, chick) {
    chick.destroy();
    this.score += 1;
    this.scoreText.text = 'Score : ' + this.score;
    this.spawnChick();
  },

  spawnEnemy: function() {
    enemy_num += 1;
    var x = this.rnd.integerInRange(0, game.world.width - 40);
    var y = this.rnd.integerInRange(0, game.world.height - 800);

    this.enemy.create(x, y, 'enemies');
    this.enemy.forEach(function(enemies) {
      game.physics.arcade.enable(enemies);
      enemies.scale.setTo(0.5, 0.5);
      enemies.body.gravity.y = 400;
    });
    
  },

  enemyHit: function(ground, enemy) {
    enemy.destroy();
    enemy_num -= 1;
  },
  
  firstspawnEnemy: function() {
    for (i=0; i<7; i++){
      var x = this.rnd.integerInRange(0, game.world.width - 40);
      var y = this.rnd.integerInRange(0, game.world.height - 800);

      this.enemy.create(x, y, 'enemies');
      this.enemy.forEach(function(enemies) {
        game.physics.arcade.enable(enemies);
        enemies.scale.setTo(0.5, 0.5);
        enemies.body.gravity.y = 400;
      });
    }    
  },

  end: function(player, coin) {
    player.destroy();
    end = true;
    this.endText = game.add.text(300, 250, 'You are dead', {
      fontSize: '20px',
      fill: '#FF0000'
    });
  }

};

// Phaser.Game(width, height, renderer, HTML Element);
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

game.state.add('main', mainState);
game.state.start('main');
