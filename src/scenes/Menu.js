class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.audio('sfx_select', './assets/plasterbrain__pc-game-ui-select.flac');
    }
  
    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
  
        game.input.mouse.capture = true;
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Nut Dash: Leave my nuts alone!', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Click to jump/Double Jump', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.5 + borderUISize + borderPadding, 'Press ↓ for credits', menuConfig).setOrigin(0.5);
        
  
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          this.sound.play('sfx_select')
          this.scene.start("playScene");    
        }   
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          gameOptions.platformStartSpeed *= 1.5,
          gameOptions.backgroundspeed = .75
          this.sound.play('sfx_select')
          this.scene.start("playScene");    
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            //credits
            this.sound.play('sfx_select')
            this.scene.start("creditsScene");    
          }
      }
  }

