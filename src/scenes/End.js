class End extends Phaser.Scene{
    constructor() {
        super("endScene");
    }

    preload(){
        this.load.audio('sfx_select', './assets/plasterbrain__pc-game-ui-select.flac');
    }
  
    create() {
        // menu text configuration
        let endconfig = {
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
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Thanks for playing!', endconfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, `High-score: ${localStorage.score} `, endconfig).setOrigin(0.5);
        endconfig.backgroundColor = '#00FF00';
        endconfig.color = '#000';

        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press (R) to Restart or ← for Menu', endconfig).setOrigin(0.5);
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
  
    update() {  
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
          // starts menuscene
          this.sound.play('sfx_select')
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // starts menuscene
            this.sound.play('sfx_select')
            this.scene.start("menuScene");    
        }

        if(gameOptions.highscore >= localStorage.score){
            localStorage.score = gameOptions.highscore
        }

    }
}