import CustomElement from '../CustomElement';
import { CommonElements } from '../../index';
import './index.css';

export default class Toast extends CustomElement{
    _timeId = null;
    _body = null;
    _cancelBtn = null;

    constructor({ parentId, id, content = '알람' }) {
        super({
            parentId,
            id,
            tagName:'div',
            classList:['toast']
        });

        this.body = new CommonElements.CustomElement({
            parentId: this.id,
            id: `${this.id}-body`,
            tagName: 'div',
            classList: ['toast-body']
        });

        this.body.elem.innerText = content;

        this.cancelBtn = new CommonElements.CustomButton({
            parentId: this.id,
            id: `${this.id}-cancel-btn`,
            classList: ['toast-btn', 'toast-cancel-btn'],
            content: 'X'
        });

        this.cancelHandler = () => {
            this.hide();
        }

        this.hide();
    }

    get timeId(){
        return this._timeId;
    }

    set timeId(value){
        this._timeId = value;
    }

    get body(){
        return this._body;
    }

    set body(value){
        this._body = value;
    }

    get cancelBtn() {
        return this._cancelBtn;
    }

    set cancelBtn(value) {
        this._cancelBtn = value;
    }

    get content() {
        return this.body.elem.innerText;
    }

    set content(value) {
        this.body.elem.innerText = value;
    }

    show() {
        this.elem.style.visibility = 'visible';
        this.elem.style.height = '40px';
        if(this.timeId) clearTimeout(this.timeId);
        this.timeId = setTimeout(() => {
           this.hide();
        },3000);
    }

    hide() {
        this.elem.style.visibility = 'hidden';
        this.elem.style.height = '0px';
    }

    set cancelHandler(value){
        this.cancelBtn.clickHandler = value;
    }
}