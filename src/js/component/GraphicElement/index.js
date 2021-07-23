import CustomElement from '../CustomElement';

export default class GraphicElement extends CustomElement{
    constructor({parentId, id, tagName, content = '', classList}){
        super({parentId, id, tagName, content, classList, xmlns : 'http://www.w3.org/2000/svg'});
    }
}