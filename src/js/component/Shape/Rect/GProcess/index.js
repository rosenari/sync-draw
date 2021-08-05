import Rect from '../index';
import TransformManager from "../../../../service/TransformManager";

class GProcess extends Rect {

    constructor({ parentId, id, x = 0, y = 0, width = 0, height = 0, classList, handlers }) {
        super({ parentId, id, x, y, width, height, classList, handlers });
    }
}

export default TransformManager.wrapShape(GProcess);