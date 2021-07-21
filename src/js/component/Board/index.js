import GraphicElement from '../GraphicElement';

export default class Board extends GraphicElement{
    constructor({ parentId, content = '', classList, handlers = {}}) {
        super({ parentId, id: 'board', tagName: 'svg', content, classList, handlers});

        this.elem.setAttribute('style',`width: 100%; height: 100%;`);
    }
}