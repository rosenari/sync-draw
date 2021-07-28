import GraphicElement from '../GraphicElement';

class Line extends GraphicElement {
    _points = [];
    _line = null;

    constructor({ parentId, id, startX, startY, classList, handlers}) {
        super({
            parentId,
            id,
            tagName: 'g',
            classList,
            handlers
        });

        this.line = new GraphicElement({
            parentId: this.id,
            id: id + '_line',
            tagName: 'polyline'
        });

        this.line.elem.setAttribute('stroke','#555');
        this.line.elem.setAttribute('stroke-width','5');
        this.line.elem.setAttribute('fill','none');

        this.addPoint({
            x: startX,
            y: startY
        });
    }

    render() {
        const pointsStr = this.points.map(({ x, y }) => `${x} ${y}`).join(', ');

        this.line.elem.setAttribute('points',pointsStr);
    }

    get line() {
        return this._line;
    }

    set line(value) {
        this._line = value;
    }

    get points(){
        return this._points;
    }

    addPoint({ x, y }){
        this.points.push({
            x, y
        });
        this.render();
    }
}

export default Line;