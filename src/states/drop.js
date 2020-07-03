import State from './state'

export default class DropState extends State {

  execute(scene, bird) {
    bird.x -= 4
    bird.y += 4

    scene.eggsToDrop -= 1
    scene.eggSpawner.spawn(bird.x, bird.y)
    scene.dropPos = scene.dropPos.slice()
    this.stateMachine.transition('exit')
  }
}
