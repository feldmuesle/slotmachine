import State from './state'

export default class ExitState extends State {

  execute(scene, bird) {
    bird.x += 5;

    if (bird.x > (800 + (bird.width / 2))) {
      if (scene.eggsToDrop) {
        this.stateMachine.transition('enter')

      } else {
        bird.active = false
        this.stateMachine.transition('reveal')
      }
    }
  }
}
