export default class GroupSpawner {

  constructor(scene, keys, modifyCb) {
    this.scene = scene
    this.key = Array.isArray(keys) ? keys : [keys]
    this.modifyCb = modifyCb

    this._group = this.scene.physics.add.group()
  }

  get group() {
    return this._group
  }

  spawn(x, y) {
    return this.modifyCb(x, y, this.key)
  }
}
