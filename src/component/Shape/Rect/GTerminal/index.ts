import Rect from '../index';
import { TransformManager } from '../../../../service';
import { COMPONENT_TYPE, RATIO } from '../../../../service/constant';

class GTerminal extends Rect{
    public static type: string = COMPONENT_TYPE.GTerminal;
    public type: string = GTerminal.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        this.createInnerText('단말');
    }

    get height(){
        return this.getHeight();
    }

    set height(value) {
        this.setHeight(value);
    }

    setHeight(value: number) {
        super.setHeight(value)
        this.elem.setAttribute('ry', Math.round(value * RATIO.PERCENT_50).toString());;
    }
}

export default TransformManager.wrapShape(GTerminal);