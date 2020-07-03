import State from './state'

export default class RevealState extends State {


  // enter(scene, egg) {
  //   console.log('hello enter reveal', scene)
  // }

  execute(scene, bird) {

    const eggs = scene.eggSpawner.group
    const gems = scene.gemSpawner.group

    if (eggs.countActive(false) === 3 && gems.countActive(true) === 3) {
      this.stateMachine.transition('score')
    }

  }
}
