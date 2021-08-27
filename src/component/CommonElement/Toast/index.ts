import CustomElement from '../CustomElement';
import { CustomButton } from '../../index';
import { CreateOption } from '../../../interface';
import './index.css';

export default class Toast extends CustomElement{
    private _timeId: ReturnType<typeof setTimeout>;
    private _body: CustomElement;
    private _cancelBtn: CustomButton = null;

    constructor({ parentId, id, content = '알람' }: CreateOption) {
        super({
            parentId,
            id,
            tagName:'div',
            classList:['toast']
        });

        this.body = new CustomElement({
            parentId: this.id,
            id: `${this.id}-body`,
            tagName: 'div',
            classList: ['toast-body']
        });

        (<HTMLElement>this.body.elem).innerText = content;

        this.cancelBtn = new CustomButton({
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

    public get timeId(): ReturnType<typeof setTimeout>{
        return this._timeId;
    }

    public set timeId(value: ReturnType<typeof setTimeout>){
        this._timeId = value;
    }

    public get body(): CustomElement{
        return this._body;
    }

    public set body(value: CustomElement){
        this._body = value;
    }

    public get cancelBtn(): CustomButton {
        return this._cancelBtn;
    }

    public set cancelBtn(value: CustomButton) {
        this._cancelBtn = value;
    }

    public get content() {
        return (<HTMLElement>this.body.elem).innerText;
    }

    public set content(value) {
        (<HTMLElement>this.body.elem).innerText = value;
    }

    public show() {
        (<HTMLElement>this.elem).style.visibility = 'visible';
        (<HTMLElement>this.elem).style.height = '40px';
        if(this.timeId) clearTimeout(this.timeId);
        this.timeId = setTimeout(() => {
           this.hide();
        },3000);
    }

    public hide() {
        (<HTMLElement>this.elem).style.visibility = 'hidden';
        (<HTMLElement>this.elem).style.height = '0px';
    }

    public set cancelHandler(value){
        this.cancelBtn.clickHandler = value;
    }
}