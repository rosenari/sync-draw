import Line from '../index';
import { COMPONENT_TYPE } from '../../../../service/constant';

class GPolyline extends Line{
    static type = COMPONENT_TYPE.GPolyline;
    type = GPolyline.type;
    constructor({ parentId, id, startX = 0, startY = 0, classList, handlers }) {
        super({
            parentId,
            id,
            startX,
            startY,
            classList,
            handlers
        });
    }
}

export default GPolyline;