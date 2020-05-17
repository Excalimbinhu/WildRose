const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)
  machine = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  private block = false;

  private result = null;

  start(): void {
    this.machine.getComponent('Machine').createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);

    if (this.machine.getComponent('Machine').spinning === false) {
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.requestResult();
    } else if (!this.block) {
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }

  getAnswer(): Promise<Array<Array<number>>> {
    // Slots result with pattern
    let slotResult = [];
    // Result Line pattern
    let linePattern = []
    const _numberOfReels = this.machine.getComponent('Machine')._numberOfReels

    return new Promise<Array<Array<number>>>(resolve => {
      const patternLuck = parseFloat(Math.random().toFixed(2));

      // Check players luck
      if(patternLuck <= 0.07)
        // Each line will recive patterns of tiles
        linePattern = this.getReelPattern(3)
      else if(patternLuck <= 0.1)
        // Two lines will recive patterns of tiles
        linePattern = this.getReelPattern(2)
      else if(patternLuck <= 0.33)
        // One line will recive patterns of tiles
        linePattern = this.getReelPattern(1)

      // Check if lines has patterns
      if(linePattern.length > 0)
      {
        // Each reels line will recive pattern
        for(let i = 0; i < _numberOfReels; i++)
        {
          const test = []
          test[0] = linePattern[0];
          test[1] = linePattern[1];
          test[2] = linePattern[2];
  
          slotResult[i] = test
        }
      }

      setTimeout(() => {
        resolve(slotResult);
      }, 1000 + 500 * Math.random());
    });
  }

  // Return he pattern of tiles each reel will recive
  getReelPattern(numLines): Array<Array<number>>
  {
    let patternResult = []
    // Available reels to recive patterns
    const linePosition = [0, 1, 2]

    for(let i = 0; i < numLines; i++)
    {
      // Randomly choosing a tile sprite
      const tileSprite = Math.floor(Math.random() * 30);
      // Randomly picking a position
      const randomPosition = Math.floor(Math.random() * linePosition.length);
      // Remove reel availability
      const line = linePosition.splice(randomPosition, 1)[0];

      patternResult[line] = tileSprite;
    }

    return patternResult;
  }

  informStop(): void {
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }
}
