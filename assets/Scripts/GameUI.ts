import { _decorator, Component, director, Input, input, Label, log, Node } from 'cc';
import { Snake } from './Snake';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property(Label) timeClock : Label = null;
    @property(Snake) snakeNode : Snake = null;
    @property(Node) outcomeCurtain: Node = null;

    private static level: number = 1;
    private requiredBodyLength: number = 10;
    private isWin : boolean;

    private elapsedTime: number = 60;

    protected onLoad(): void {
        this.outcomeCurtain.active = false;
        input.on(Input.EventType.KEY_DOWN,this.tryAgain,this);
    }

    private tryAgain(){
        if(!this.snakeNode.gameOver) return;
        if(this.isWin){
            this.nextLevel();
        }
        director.loadScene("GamePlay");
        this.snakeNode.gameOver = false;
    }

    start() {
        this.requiredBodyLength = 10 + (GameUI.level - 1) * 5;
        this.timeClock.string = this.elapsedTime.toString();
    }

    update(deltaTime: number) {
        console.log(this.requiredBodyLength);
        if (this.elapsedTime > 0) {
            if (this.snakeNode.gameOver) {
                this.showCurtain(false);
                return;
            }
            this.elapsedTime -= deltaTime;
            this.timeClock.string = "Time : " + (this.elapsedTime | 0).toString();
        } else {
            this.elapsedTime = 0;
            if (this.snakeNode.getLengthOfSnake() < this.requiredBodyLength) {
                this.showCurtain(false);
            } else {
                this.showCurtain(true);
            }
        }
    }

    private showCurtain(isWin: boolean){
        this.isWin = isWin;
        this.snakeNode.gameOver = true;
        this.outcomeCurtain.active = true;
        this.outcomeCurtain.getChildByName("WIN").getComponent(Label).string = isWin ? "WIN" : "LOSE";
    }

    private nextLevel(){
        GameUI.level++;
    }
}

