import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, log, math, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Snack')
export class Snack extends Component {
    public reSpawn(){
        this.node.setPosition(60*math.randomRangeInt(-15,16),60*math.randomRangeInt(-8,9),0);
    }
}

