import CustomElement from '../CustomElement';
import { XMLNS } from '../../../service/constant';

export default class GraphicElement extends CustomElement{
    constructor({parentId, id, tagName, content = '', classList = [], handlers = {}}:{
        parentId: string;
        id: string;
        tagName: string;
        content?: string;
        classList?: Array<string>;
        handlers?: { [key: string]: any };
    }){
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