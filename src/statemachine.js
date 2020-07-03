export default class StateMachine {

  constructor(initialState, possibleStates, stateArgs = []) {
    this.initialState = initialState
    this.possibleStates = possibleStates
    this.stateArgs = stateArgs
    this.state = null

    // State instances get access to the state machine via this.stateMachine.
    for (const state of Object.values(this.possibleStates)) {
     state.stateMachine = this
    }
  }

  step() {
    if (this.state === null) {
      this.state = this.initialState
      this.possibleStates[this.state].enter(...this.stateArgs)
    }

    this.possibleStates[this.state].execute(...this.stateArgs)
  }

  transition(newState, ...enterArgs) {
    this.state = newState
    this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs)
  }
}
