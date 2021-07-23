import GraphicElement from '../GraphicElement';

export default class Board extends GraphicElement{
    constructor({ parentId, content = '', classList, screenSize = {
        width: 1000,
        height: 1000
    }, handlers = {}}) {
        super({ parentId, id: 'board', tagName: 'svg', content, classList, handlers});

        this.elem.setAttribute('viewBox',`0 0 ${screenSize.width} ${screenSize.height}`);
    }
}