import Line from '../index';

class GPolyline extends Line{
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