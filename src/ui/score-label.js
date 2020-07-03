import Phaser from 'phaser'


export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, style) {
    super(scene, x, y, score, style)

    this.score = score ? score : 0
  }

  setScore(score) {
    this.score  = score
    this.updateScoreText()
  }

  add(points) {
    this.setScore(this.score + points)
  }

  updateScoreText() {
    this.setText(this.score)
  }
}
