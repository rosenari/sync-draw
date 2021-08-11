import CustomElement from '../CustomElement';

export default class CustomSelect extends CustomElement{
    _options = null;
    constructor({parentId,id,classList,options = {},handlers}) {
        super({
           parentId,
           id,
           tagName:'select',
           classList,
           handlers
        });

        this.options = options;
    }

    get options(){
        return this._options;
    }

    set options(value){
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