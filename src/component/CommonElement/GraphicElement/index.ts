import CustomElement from '../CustomElement';
import { XMLNS } from '../../../service/constant';
import { CreateOption } from '../../../interface';

export default class GraphicElement extends CustomElement{
    constructor({parentId, id, tagName, content = '', classList = [], handlers = {}}: CreateOption){
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