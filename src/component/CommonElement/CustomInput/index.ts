import CustomElement from '../CustomElement';
import {CreateOption} from '../../../interface';

interface CustomInputOption extends CreateOption {
    type?: string;
}

export default class CustomInput extends CustomElement{
    constructor({ parentId, id, type = '', classList = [], handlers = {}}: CustomInputOption) {
        super({
            parentId,
            id,
            tagName: 'input',
            classList,
            handlers
        });

        this.elem.setAttribute('type', type);
    }
}