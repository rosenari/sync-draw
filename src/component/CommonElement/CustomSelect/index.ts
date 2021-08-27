import CustomElement from '../CustomElement';
import {CreateOption} from '../../../interface';

interface CustomSelectOption extends CreateOption{
    options?: { [key: string]: string };
}

export default class CustomSelect extends CustomElement{
    _options: { [key: string]: string } = null;
    constructor({parentId,id,classList = [],options = {},handlers = {}}: CustomSelectOption) {
        super({
           parentId,
           id,
           tagName:'select',
           classList,
           handlers
        });

        this.options = options;
    }

    get options(): { [key: string]: string }{
        return this._options;
    }

    set options(value: { [key: string]: string }){
        this._options = value;

        this.elem.innerHTML = '';
        for(const name in this.options){
            const option = document.createElement('option');
            option.setAttribute('value', this.options[name]);
            option.innerText = name;
            this.elem.appendChild(option);
        }
    }
}