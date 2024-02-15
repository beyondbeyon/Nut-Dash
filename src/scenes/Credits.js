class Credits extends Phaser.Scene {
    constructor(){
        super("creditsScene");
    }

    preload(){
        this.load.audio('sfx_select', './assets/plasterbrain__pc-game-ui-select.flac');
    }
  
    create() {
        // menu text configuration
        let creditsConfig = {
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
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Thanks for playing!', creditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Sprites created by: Ethans pixel art shop ', creditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'audio created by: Hourofmidnight, Jalastram', creditsConfig).setOrigin(0.5);
        creditsConfig.backgroundColor = '#00FF00';
        creditsConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/1.5 , 'psychentist, Mrthenoronha, plasterbrain ', creditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.5 + borderUISize + borderPadding, 'Press ↑ to go to menu', creditsConfig).setOrigin(0.5);
        
  
        // define keys
        
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }
  
    update() {  
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
          // starts menuscene
          this.sound.play('sfx_select')
          this.scene.start("menuScene");    
        }
      }
  }