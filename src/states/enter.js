import State from './state'

export default class EnterState extends State {

  enter(scene, bird) {
    bird.x = 0

    if (!scene.dropPos.length && !bird.active) {
      scene.scene.restart()
    }
  }

  execute(scene, bird) {
    const dropPosition = scene.dropPos[0]
    const withinRange = bird.x <= dropPosition + 3 && bird.x >= dropPosition - 3

    bird.x += 5

    if (withinRange) {
      scene.dropPos.shift()
      this.stateMachine.transition('dropEgg');
    }
  }
}
