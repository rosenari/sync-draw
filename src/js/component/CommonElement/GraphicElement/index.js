import CustomElement from '../CustomElement';
import { XMLNS } from '../../../service/constant';

export default class GraphicElement extends CustomElement{
    constructor({parentId, id, tagName, content = '', classList, handlers = {}}){
        super({
            parentId,
            id,
            tagName,
            content,
            classList,
            handlers,
            xmlns : XMLNS});
    }
}