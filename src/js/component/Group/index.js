import GraphicElement from '../GraphicElement';

export default class Group extends GraphicElement{
    constructor({ parentId, id, classList, handlers }) {
        super({ parentId, id, tagName: 'g', classList, handlers });
    }
}