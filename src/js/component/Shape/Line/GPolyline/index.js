import Line from '../index';

class GPolyline extends Line{
    static type = 'GPolyline';
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