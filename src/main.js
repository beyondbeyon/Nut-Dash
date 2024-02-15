//Bryon Anderson CMPM-120
//endless runner - Nut Dash
//for some reason none of my assets would load I'm not quite sure why the game was not
//intially going top be made from the green boxes phaser inputs
//Also had trouble implementing end game screen to stop game loop

// global game options
let gameOptions = {
    platformSpeedRange: [300, 300],
    backgroundspeed: .5,
    spawnRange: [80, 300],
    platformSizeRange: [75, 300],
    platformHeightRange: [-5, 5],
 
    // a scale to be multiplied by platformHeightRange
    platformHeighScale: 20,
 
    // platform max and min height, as screen height ratio
    platformVerticalLimit: [0.4, 0.8],
    playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2,
    acornPercent: 25,
    highscore: 0
}
    // object containing configuration options
    let config = {
        type: Phaser.CANVAS,
        width: 800,
        height: 750,
        scene:[ Menu, Play, End ,Credits],
        backgroundColor: 0x444444,
 
        // physics settings
        physics: {
            default: "arcade"
        }
    }
    let game = new Phaser.Game(config);
    let borderUISize = game.config.height / 15;
    let borderPadding = borderUISize / 3;
    let keyF, keyR, keyLEFT, keyRIGHT, keyDOWN, keyUP, keyA, keyD, keyW;
    