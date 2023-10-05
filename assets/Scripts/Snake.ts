import { _decorator, BoxCollider, BoxCollider2D, Collider2D, Component,Contact2DType,EventKeyboard, Input, input, instantiate, ITriggerEvent, KeyCode, macro, Node, Prefab, v3, Vec3 } from 'cc';
import { Snack } from './Snack';
const { ccclass, property } = _decorator;

@ccclass('Snake')
export class Snake extends Component {
    @property(Prefab) private segment: Prefab = null;
    @property(BoxCollider2D) headCollider : BoxCollider2D = null;

    private bodies : Node[] = [];
    private direction : Vec3 = new Vec3(-1,0);
    private snakeLength : number = 1;
    
    public gameOver: boolean = false;


    protected onLoad(): void {
        this.bodies.push(this.headCollider.node);
        input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        this.headCollider.on(Contact2DType.BEGIN_CONTACT,this.eatEvent,this);
    }

    protected start(): void {
        this.schedule(this.move, 0.15, macro.REPEAT_FOREVER, 0);
    }

    private eatEvent(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 1) {
            otherCollider.node.getComponent(Snack).reSpawn();
            this.growSnake();
        }
    }

    public getLengthOfSnake(){
        return this.snakeLength;
    }

    private growSnake(){
        this.snakeLength++;
        let newSegment = instantiate(this.segment);
        let tailPostion = this.bodies[this.bodies.length - 1].getPosition();
        newSegment.position = tailPostion;
        newSegment.parent = this.node;
        this.bodies.push(newSegment);
    }

    private onKeyDown(event: EventKeyboard){
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                this.direction = v3(-1,0,0);
                break;
            case KeyCode.ARROW_RIGHT:
                this.direction = v3(1,0,0);
                break;
            case KeyCode.ARROW_DOWN:
                this.direction = v3(0,-1,0);
                break;
            case KeyCode.ARROW_UP:
                this.direction = v3(0,1,0);
            default:
                break;
        }
    }

    private move(){
        if(this.gameOver) return;
        let currentPos = this.bodies[0].position;
        let newPos = new Vec3(currentPos.x + this.direction.x*60,currentPos.y+this.direction.y*60);
        for(let i=this.bodies.length - 1; i>0 ; i--){
            this.bodies[i].position = this.bodies[i-1].position;
        }
        this.bodies[0].position = newPos;

        this.checkBiteItself();
        this.checkOutOfBound();
    }

    private checkBiteItself(){
        for (let index = 1; index < this.bodies.length; index++) {
            if(this.bodies[index].position.strictEquals(this.bodies[0].position)){
                this.gameOver = true;
            }
        }
    }

    private checkOutOfBound(){
        if(Math.abs(this.bodies[0].position.x) > 960){
            let x = new Vec3(-this.bodies[0].position.x,this.bodies[0].position.y,0);
            this.bodies[0].position = x;
        }
        if(Math.abs(this.bodies[0].position.y) > 540){
            let x = new Vec3(this.bodies[0].position.x,-this.bodies[0].position.y,0);
            this.bodies[0].position = x;
        }
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        this.headCollider.off(Contact2DType.BEGIN_CONTACT,this.eatEvent,this);
        this.unschedule(this.move);
    }

}

