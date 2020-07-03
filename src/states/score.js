import State from './state'

const GEM_POS_Y = 450

export default class ScoreState extends State {

  execute(scene, _) {
    const gems = scene.gemSpawner.group
    let counter = 0

    gems.setVelocityY(-50)

    gems.children.iterate((gem) => {
      gem.body.allowGravity = false
      if (gem.y <= GEM_POS_Y ) {
        gem.body.stop()
        counter ++
      }
    })

    gems.rotate(0.02)

    if (counter === 3 && (!scene.winnerText || !scene.winnerText.active)) {

      const newScore = scene.calculateScore(scene.matches)

      gems.setVelocityY(0)
      scene.winnerText = scene.createWinnerText(400, 300, scene.matches)
      scene.scoreLabel.add(newScore)
      scene.score = scene.score + newScore

      scene.time.delayedCall(3000, () => {
          this.stateMachine.transition('restart')
      }, null, scene)
    }
  }
}
