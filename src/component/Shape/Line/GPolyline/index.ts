import Line from '../index';
import { COMPONENT_TYPE } from '../../../../service/constant';
import {TransformManager} from "../../../../service";

class GPolyline extends Line{
    public static type: string = COMPONENT_TYPE.GPolyline;
    public type: string = GPolyline.type;
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

export default TransformManager.wrapLine(TransformManager.wrapShape(GPolyline));