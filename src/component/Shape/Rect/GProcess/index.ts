import Rect from '../index';
import { TransformManager } from '../../../../service';
import { COMPONENT_TYPE } from '../../../../service/constant';

class GProcess extends Rect {
    public static type: string = COMPONENT_TYPE.GProcess;
    public type: string = GProcess.type;

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });

        this.createInnerText('처리');
    }
}

export default TransformManager.wrapShape(GProcess);