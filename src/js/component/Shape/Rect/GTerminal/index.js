import Rect from '../index';
import TransformManager from '../../../../service/TransformManager';

class GTerminal extends Rect{

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }

    get height(){
        return super.height;
    }

    set height(value) {
        super.height = value;
        this.elem.setAttribute('ry', (value * 0.5).toFixed(2));
    }
}

export default TransformManager.wrapShape(GTerminal);