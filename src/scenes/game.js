import Phaser from 'phaser'
import {default as imageKeys} from '../configs/image-keys'
import StateMachine from '../statemachine'
import EnterState from '../states/enter'
import DropState from '../states/drop'
import ExitState from '../states/exit'
import RevealState from '../states/reveal'
import ScoreState from '../states/score'
import RestartState from '../states/restart'
import GroupSpawner from './group-spawner'
import ScoreLabel from '../ui/score-label'
import ImageButton from '../ui/button'
import WebFontFile from '../loaders/webfont-loader'

const {
  SKY_KEY,
  GROUND_KEY,
  BIRD1_KEY,
  BIRD2_KEY,
  EGG_KEY,
  GEM1_KEY,
  GEM2_KEY,
  GEM3_KEY,
  PARTICLE_KEY,
  BUTTON_KEY,
  GRASS_KEY } = imageKeys

export default class Gamescene extends Phaser.Scene {
  constructor() {
    super('game-scene')

    this.winnerText = null
    this.symbols = []
    this.prize = null
    this.eggSpawner = null
    this.startButton = null
    this.eggsToDrop = null
    this.dropPos = []
    this.score = 0
    this.scoreLabel = null
    this.matches = null
  }

  init(data) {
    this.symbols = data.symbols.map((symKey) => imageKeys[symKey])
    this.prize = data.prize
  }

  preload() {

      this.load.addFile(new WebFontFile(this.load, ['Lemon', 'Press Start 2P']))

      this.load.image(SKY_KEY, 'assets/sky.png')
      this.load.image(GROUND_KEY, 'assets/platform.png')
      this.load.image(GEM1_KEY, 'assets/orange.png')
      this.load.image(GEM2_KEY, 'assets/red.png')
      this.load.image(GEM3_KEY, 'assets/green.png')
      this.load.image(BIRD1_KEY, 'assets/animations/bird/frame-1.png')
      this.load.image(BIRD2_KEY, 'assets/animations/bird/frame-2.png')
      this.load.image(EGG_KEY, 'assets/egg.png')
      this.load.image(GRASS_KEY, 'assets/grass.png')
      this.load.image(PARTICLE_KEY, 'assets/particles/sparkle-pink.png')
      this.load.image(BUTTON_KEY, 'assets/button.png')
    }

    create() {
      this.add.image(400, 300, SKY_KEY)
      this.dropPos = this.createDroppingPositions()
      this.symbols = JSON.parse(JSON.stringify(this.createRandomSymbolSequence()))
      this.eggsToDrop = this.symbols.length
      this.matches = this.calculateMatches()
      const ground = this.createPlatforms()
      this.createGrass()
      this.eggSpawner = new GroupSpawner(this, EGG_KEY, this.createEggs)
      this.gemSpawner = new GroupSpawner(this, this.symbols, this.createGems)
      this.bird = this.createBird()
      this.scoreLabel = this.createScoreLabel(710, 550, this.score)

      this.stateMachine = new StateMachine('enter', {
        enter: new EnterState(),
        dropEgg: new DropState(),
        exit: new ExitState(),
        reveal: new RevealState(),
        score: new ScoreState(),
        restart: new RestartState()
      }, [this, this.bird]);

      const eggsGroup = this.eggSpawner.group
      const gemsGroup = this.gemSpawner.group

      this.physics.add.collider(gemsGroup, ground)
      this.physics.add.collider(eggsGroup, ground,this.openEgg, null, this)
    }

    update() {
      this.stateMachine.step()
    }

    createPlatforms() {
      const ground = this.physics.add.staticGroup()
      ground.create(400, 584, GROUND_KEY).setScale(2, 1).refreshBody()

      return ground
    }

    createGrass() {
      const grass = this.physics.add.staticGroup({
        key: GRASS_KEY,
        repeat: 40,
        setXY: { x: 0, y: 555, stepX: 20 }
      })

      grass.children.iterate((child, index) => {
        if (index % 2) {
          child.setY(child.y + 20)
        }
      })

      return grass
    }

    createEggs(x, y, key) {
      const [eggKey] = key
      const eggs = this.group.create(x, y, eggKey)
      eggs.setCollideWorldBounds(true)
      eggs.setBounceY(Phaser.Math.FloatBetween(0.3, 0.5))

      return eggs
    }

    createGems(x, y, key) {
      const gemKey = key.shift()
      const gems = this.group.create(x, y, gemKey)

      gems.setCollideWorldBounds(true)
      gems.setScale(0.4)
      gems.setY(gems.y - 50)
      gems.setBounceY(0.2)

      return gems
    }

    createBird() {
      this.anims.create({
        key: 'fly',
        frames: [{key: BIRD1_KEY, frame: null}, {key: BIRD2_KEY, frame: null}],
        frameRate: 2,
        repeat: -1,
        depth: 100
      })

      return this.add.sprite(150, 120, BIRD1_KEY).play('fly')
    }

    createDroppingPositions() {
      const { width } = this.sys.game.canvas;
      const padding = 10
      const colWidth = (width - ( 2 * padding)) / 3

      return [...Array(3).keys()]
        .map((pos, index) => {
          const start = (colWidth * index) + padding
          const end = (colWidth * (index + 1)) - padding

          return Phaser.Math.Between(start, end)
        })
    }

    createRandomSymbolSequence() {
      return this.symbols.map(() => {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)]
      })
    }

    calculateMatches() {
      let match = 3

      const result = this.symbols.reduce((acc, symbol) => {
        const value = acc[symbol] ? acc[symbol] += 1 : 1
        acc[symbol] = value

        return acc
      }, {})

      const [_, matches]= Object.entries(result)
        .find(([_, value]) => {
          match --
          return value >= match
        })

      return matches
    }

    createPlayButton(x, y, callBack) {
      const style = {
        fill: '#031634',
        fontFamily: 'Lemon'
      }

      return new ImageButton(this, x, y, BUTTON_KEY, 'Again', style, () => callBack())
    }

    createExitButton(x, y, callBack) {
      const style = {
        fill: '#031634',
        fontFamily: 'Lemon'
      }

      return new ImageButton(this, x, y, BUTTON_KEY, 'Exit', style, () => callBack())
    }

    createWinnerText(x, y, matchScore) {

      let winnerText = 'better luck next time'
      if (matchScore === 2) {
          winnerText = 'you won'
        } else if (matchScore === 3) {
          winnerText = 'you won the big price'
        }

      const match = matchScore > 1 ? `${matchScore} matches ${'!'.repeat(matchScore)}` : 'No matches - '
      const text = `${match} \n ${winnerText}`

      const style = {
        fontFamily: 'Lemon',
        fontSize: '40px',
        align: 'center',
        fill: '#eedb00'
       }
      const label = this.add.text(x, y, text, style)
      label.setOrigin(0.5, 0.5)

      this.add.existing(label)

      return label
    }

    createScoreLabel(x, y, score) {
      const style = {
        fontSize: '30px',
        fontFamily: 'Lemon',
        fixedWidth: '70',
        align: 'right',
        fill: '#fff',
        stroke: '#C9A989',
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

      const label = new ScoreLabel(this, x, y, score, style)
      this.add.existing(label)

      return label
    }

    calculateScore(matches) {
      if (matches === 2) return this.prize / 10

      if (matches === 3) return  this.prize

      return 0
    }

    openEgg(egg, _) {
      if (egg.active) {
        const tween = this.add.tween({
          targets: egg,
          scaleX: 1.4,
          scaleY: 1.4,
          duration: 500,
          ease: 'Power2',
          repeat: 1 ,
          yoyo: true,
          delay: 100,
        })

        egg.active = false

        tween.on('complete', (tween, target) => {
          const particles = this.add.particles(PARTICLE_KEY)
          const emitter = particles.createEmitter({
              speed: 100,
              scale: { start: .5, end: .7 },
              blendMode: 'SCREEN'
          })

          emitter.startFollow(egg)
          egg.disableBody(true, true)
          setTimeout(() => {
            emitter.stop()
            particles.destroy()

            this.gemSpawner.spawn(egg.x, egg.y)
          }, 500)

        })

        return false
      }
    }
}
