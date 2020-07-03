import Phaser from 'phaser'
import StartScene from './scenes/start'
import GameScene from './scenes/game'

const config = {
	type: Phaser.AUTO,
	scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		}
	},
	scene: [ StartScene, GameScene]
}

export default new Phaser.Game(config)
