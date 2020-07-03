import State from './state'

export default class RestartState extends State {
  enter(scene, _) {
    const gems = scene.gemSpawner.group
    const startButton = scene.createPlayButton(400, 300, () => {
      this.stateMachine.transition('enter')
    })
    const exitButton = scene.createExitButton(400, 400, () => {
      scene.score = 0
      scene.scene.start('start-scene')
    })

    gems.children.iterate((gem) => {
      gem.disableBody()
      gem.visible = false
    })

    scene.winnerText.destroy()
    scene.add.existing(startButton);
    scene.add.existing(exitButton);
  }
}
