import Rect from '../index';
import TransformManager from '../../../../service/TransformManager';

class GProcess extends Rect {
    static type = 'GProcess';
    type = GProcess.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        if(this.id !== 'placeholder') this.createInnerText('처리');
    }
}

export default TransformManager.wrapShape(GProcess);