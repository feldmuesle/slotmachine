import Phaser from 'phaser'

export default class ImageButton extends Phaser.GameObjects.Container {

  constructor(scene, x, y, key, text, style, callback) {
    super(scene)

    this.scene = scene
    this.x = x
    this.y = y
    this.buttonText = null

    const button = this.scene.add.image(x, y, key)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState() )
      .on('pointerout', () => this.enterButtonRestState() )
      .on('pointerdown', () => this.enterButtonActiveState() )
      .on('pointerup', () => {
        this.enterButtonHoverState();
        callback();
      })

    const buttonText = this.scene.add.text(x, y, text, style)
    this.buttonText = buttonText

    Phaser.Display.Align.In.Center(this.buttonText, button)
  }

  enterButtonHoverState() {

    this.buttonText.setStyle({ fill: '#fff'});
  }

  enterButtonRestState() {
    this.buttonText.setStyle({ fill: '#031634' });
  }

  enterButtonActiveState() {
    this.buttonText.setStyle({ fill: '#fff' });
  }
}
