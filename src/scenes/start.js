import Phaser from 'phaser'
import {default as imageKeys} from '../configs/image-keys'
import ImageButton from '../ui/button'
import WebFontFile from '../loaders/webfont-loader'

const {SKY_KEY, BIRD1_KEY, BIRD2_KEY, BUTTON_KEY} = imageKeys

const data = { symbols: ['GEM1_KEY', 'GEM2_KEY', 'GEM3_KEY'], prize: 100 }

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('start-scene')

    this.bird = null
    this.forward = true
    this.counter = 0
    this.timer = 400
    this.initData = {}
  }

  init(data) {
    this.initData = data
  }

  preload() {
    this.load.addFile(new WebFontFile(this.load, ['Lemon']))

    this.load.image(SKY_KEY, 'assets/sky.png')
    this.load.image(BIRD1_KEY, 'assets/animations/bird/frame-1.png')
    this.load.image(BIRD2_KEY, 'assets/animations/bird/frame-2.png')
    this.load.image(BUTTON_KEY, 'assets/button.png')
  }

  create() {
    this.add.image(400, 300, SKY_KEY)
    this.createStartText()
    this.bird = this.createBird()
    this.createStartButton(400, 340, () => this.scene.start('game-scene', data))
    this.encourageStart(this.bird)
  }

  update() {
    this.timer++

    if (this.timer > 400) {
      if (this.counter <= 5 ) {
        this.encourageStart()
      } else {
        this.timer = 0
        this.counter = 0
      }
    }
  }

  createStartText() {
    const style = {
      fontSize: '65px',
      fontFamily: 'Lemon',
      fill: '#C75482',
      stroke: '#fff',
      strokeThickness: 3,
      shadow: {
          offsetX: 1,
          offsetY: 2,
          color: '#000',
          blur: 3,
          stroke: false,
          fill: false
      }
    }

    return this.add.text(400, 180, 'Lucky bird', style )
      .setOrigin(.5, .5)
  }

  createBird() {
    this.anims.create({
      key: 'fly',
      frames: [{key: BIRD1_KEY, frame: null}, {key: BIRD2_KEY, frame: null}],
      frameRate: 2,
      repeat: -1,
      depth: 100
    })

    return this.add.sprite(50, 310, BIRD1_KEY).play('fly')
  }

  encourageStart() {
    if (this.bird.x >= 280 && this.forward) {
      this.forward = false
    }

    if (this.bird.x <= 240 && !this.forward) {
      this.forward = true
      this.counter++
    }

    if (this.forward) {
      this.bird.x += 4
    }

    if (!this.forward) {
      this.bird.x -= 2
    }
  }

  createStartButton(x, y, callBack) {
    const style = {
      fill: '#031634',
      fontFamily: 'Lemon'
    }

    return new ImageButton(this, x, y, BUTTON_KEY, 'Start', style, () => callBack())
  }
}
