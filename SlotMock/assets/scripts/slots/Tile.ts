const { ccclass, property } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
  @property({ type: [cc.SpriteFrame], visible: true })
  private textures = [];

  // Children TileGlow
  @property({ type: cc.Node })
  private tileGlow = null;

  // Gets TileGlow children and set animation disabled
  start(): void{
    this.tileGlow = this.node.getChildByName("TileGlow");
    this.stopGlowing();
  }

  async onLoad(): Promise<void> {
    await this.loadTextures();
  }

  async resetInEditor(): Promise<void> {
    await this.loadTextures();
    this.setRandom();
  }

  async loadTextures(): Promise<boolean> {
    const self = this;
    return new Promise<boolean>(resolve => {
      cc.loader.loadResDir('gfx/Square', cc.SpriteFrame, function afterLoad(err, loadedTextures) {
        self.textures = loadedTextures;
        resolve(true);
      });
    });
  }

  setTile(index: number): void {
    this.node.getComponent(cc.Sprite).spriteFrame = this.textures[index];
  }

  setRandom(): void {
    const randomIndex = Math.floor(Math.random() * this.textures.length);
    this.setTile(randomIndex);
  }

  // Enable glowing animation
  startGlowing(): void {
    this.tileGlow.getComponent("sp.Skeleton").enabled = true
  }

  // Disable glowing animation
  stopGlowing(): void {
    this.tileGlow.getComponent("sp.Skeleton").enabled = false
  }
}