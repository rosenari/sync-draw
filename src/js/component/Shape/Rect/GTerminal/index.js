import Rect from '../index';
import TransformManager from '../../../../service/TransformManager';
import {RATIO} from '../../../../service/constant';

class GTerminal extends Rect{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        if(this.id !== 'placeholder') this.createInnerText('단말');
    }

    get height(){
        return super.height;
    }

    set height(value) {
        super.height = value;
        this.elem.setAttribute('ry', Math.round(value * RATIO.PERCENT_50));
    }
}

export default TransformManager.wrapShape(GTerminal);