//adaptation/retyping of endless runnner code by Emanuele Feronato 
//found @:https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
        this.load.image('platform', './assets/platform.png');
        this.load.image('acorn', './assets/acorn.png');
        this.load.image('background', './assets/plx-1.png');
        this.load.image('plx', './assets/plx-3.png');
        this.load.spritesheet('squirrel', './assets/Squirrelss.png', 
        {frameWidth: 32, frameHeight: 32});
        this.load.audio('sfx_death', './assets/psychentist__ratdeath.mp3');
        this.load.audio('music', './assets/mrthenoronha__cartoon-game-theme-loop-2.wav');
        this.load.audio('sfx_jump', './assets/jalastram__sfx_jump_11.wav');
        this.load.audio('sfx_select', './assets/plasterbrain__pc-game-ui-select.flac');
        this.load.audio('sfx_collect', './assets/hourofmidnight__crunch-noise.wav');
    }

    create(){

        this.background = this.add.tileSprite(0, 0, 384, 216, 'background').setOrigin(0,0).setDisplaySize(800, 750);
        this.plx = this.add.tileSprite(0, 0, 384, 216, 'plx').setOrigin(0,0).setDisplaySize(800, 750);

        this.music = this.sound.add('music')
        this.music.setLoop(true)
        this.music.play()

        // group with all active platforms.
        this.platformGroup = this.add.group({
 
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });
 
        // pool
        this.platformPool = this.add.group({
 
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });

        this.acornGroup = this.add.group({

            removeCallback: function(acorn){
                acorn.scene.acornPool.add(acorn)
            }
        })

        this.acornPool = this.add.group({
            removeCallback: function(acorn){
                acorn.scene.acornGroup.add(acorn)
            }
        })


        this.addedPlatforms = 0

        this.anims.create({
            key: 'run',
            frameRate: 30,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('squirrel', { 
                frames: [16,16,16,16,17,17,17,18,18,18,19,19,19,20,20,20,21,21,21,22,22,22,23,23,23,23]
            }),
        });
        
        this.anims.create({
            key: 'jump',
            frameRate: 30,
            frames: this.anims.generateFrameNumbers('squirrel', { 
                frames: [20,20,20,20,20,21,21,21,21,22,22,22,23,23,23]
            }),
        });
 
        // number of consecutive jumps made by the player
        this.playerJumps = 0;

 
        // adding a platform to the game, the arguments are platform width and x position
        this.addPlatform(game.config.width, game.config.width /2, game.config.height * gameOptions.platformVerticalLimit[1]);
 
        // adding the player;
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height / 2, "squirrel");
        this.player.setScale(2.5)
        this.player.setGravityY(gameOptions.playerGravity);
        
 
        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, this.platformGroup, function(){
            if(!this.player.anims.isPlaying){
                this.player.anims.play('run')
            }
        },null, this);

        this.physics.add.overlap(this.player, this.acornGroup, function(player, acorn){
            this.p1Score += 5
            this.acornGroup.killAndHide(acorn)
            this.acornGroup.remove(acorn)
        },null,this)
        
 
        // checking for input
        this.input.on("pointerdown", this.jump, this);

        this.gameOver = false;

        //save score locally 
        this.p1Score = 0

        localStorage.setItem("highscore", gameOptions.highscore)

        


        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        this.clock = this.time.delayedCall(2000, () => {
            //this.p1Score += 10
            //this.scoreLeft.text = this.p1Score
        },);

        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        

    }

    
    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY){
        this.addedPlatforms ++;
        let platform;
        this.mark = 100

        if(this.p1Score >= this.mark){
            this.mark += 100
            //platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1) * 1.5;
        }
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio =  platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
 
        // is there a acorn over the platform?
        if(this.addedPlatforms > 1){
            if(Phaser.Math.Between(1, 100) <= gameOptions.acornPercent){
                if(this.acornPool.getLength()){
                    let acorn = this.acornPool.getFirst();
                    acorn.x = posX;
                    acorn.y = posY - 96;
                    acorn.alpha = 1;
                    acorn.active = true;
                    acorn.visible = true;
                    this.acornPool.remove(acorn);
                }
                else{
                    let acorn = this.physics.add.sprite(posX, posY - 96, "acorn");
                    acorn.setScale(.5)
                    acorn.setImmovable(true);
                    acorn.setVelocityX(platform.body.velocity.x);
                    acorn.setDepth(2);
                    this.acornGroup.add(acorn);
                }
            }
        }
    }
 
    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    jump(){
        if(this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)){
            if(this.player.body.touching.down){
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps ++;
            this.player.play('jump')
            this.sound.play('sfx_jump')
            this.p1Score += 10
            this.scoreLeft.text = this.p1Score
        }
    }

    update(){
 
        // game over
        if(this.player.y > game.config.height){
            this.music.stop()
            this.sound.play('sfx_death')
            this.gameOver = true;
            this.scene.start('endScene')
            gameOptions.highscore = this.p1Score
        };
        

        this.player.x = gameOptions.playerStartPosition;

        this.plx.tilePositionX += gameOptions.backgroundspeed

        this.mark = 100

        if(this.p1Score >= this.mark){
            this.mark += 100
            gameOptions.platformStartSpeed *= 1.5
        }
        
        

 
        // recycling platforms
        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        this.acornGroup.getChildren().forEach(function(acorn){
            if(acorn.x < - acorn.displayWidth / 2){
                this.sound.play('sfx_collect')
                this.acornGroup.killAndHide(acorn)
                //this.p1Score += 5
                this.acornGroup.remove(acorn)
            }
        }, this)
 
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }

        
    }
};

