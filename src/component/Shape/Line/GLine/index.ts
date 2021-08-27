import Line from '../index';
import { GraphicElement } from '../../../../component';
import {COMPONENT_TYPE} from '../../../../service/constant';
import {TransformManager} from "../../../../service";

class GLine extends Line {
    public static type: string = COMPONENT_TYPE.GLine;
    public type: string = GLine.type;
    _marker = null;

    constructor({ parentId, id, startX, startY, classList, handlers }){
        super({
            parentId,
            id,
            startX,
            startY,
            classList,
            handlers
        });

        this.marker = new GraphicElement({
            parentId: this.id,
            id: id + '_marker',
            tagName: 'marker'
        });

        this.marker.elem.setAttribute('markerWidth','10');
        this.marker.elem.setAttribute('markerHeight','10');
        this.marker.elem.setAttribute('refX','3');
        this.marker.elem.setAttribute('refY','1.5');
        this.marker.elem.setAttribute('orient','auto');

        this.arrow = new GraphicElement({
            parentId: this.marker.id,
            id: id + '_arrow',
            tagName: 'polygon'
        });

        this.arrow.elem.setAttribute('points','0 0, 5 1.5, 0 3');
        this.line.elem.setAttribute('marker-end',`url(#${this.marker.id})`);
    }

    get marker() {
        return this._marker;
    }

    set marker(value) {
        this._marker = value;
    }
}

export default TransformManager.wrapLine(TransformManager.wrapShape(GLine));