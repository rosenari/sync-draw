import CustomElement from '../CustomElement';

export default class CustomSelect extends CustomElement{
    constructor({parentId,id,classList,options = {},handlers}) {
        super({
           parentId,
           id,
           tagName:'select',
           classList,
           handlers
        });

        for(const name in options) {
            const option = document.createElement('option');
            option.setAttribute('value', options[name]);
            option.innerText = name;
            this.elem.appendChild(option);
        }
    }
}