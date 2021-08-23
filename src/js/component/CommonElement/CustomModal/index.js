import CustomElement from '../CustomElement';
import { CommonElements } from '../../index';
import './index.css';

export default class CustomModal extends CustomElement{
    _type = null;
    _modal = null;
    _header = null;
    _body = null;
    _btnBody = null;
    _input = null;
    _select = null;
    _confirmBtn = null;
    _deleteBtn = null;
    _cancelBtn = null;

    constructor({ parentId, id, type = 'confirm', title = '타이틀', content }) {
        super({
            parentId,
            id,
            tagName:'div',
            classList:['modal-background']
        });

        this.type = type;
        this.modal = new CommonElements.CustomElement({
            parentId:this.id,
            id:`${this.id}-modal`,
            tagName:'div',
            classList:['modal']
        });
        this.header = new CommonElements.CustomElement({
            parentId: this.modal.id,
            id: `${this.id}-title`,
            tagName: 'div',
            classList: ['modal-title']
        });
        this.header.elem.innerText = title;

        this.createBody(content);

        this.btnBody = new CommonElements.CustomElement({
            parentId:this.modal.id,
            id:`${this.id}-modal-btn-body`,
            tagName:'div',
            classList:['modal-btn-body']
        });

        this.confirmBtn = new CommonElements.CustomButton({
            parentId: this.btnBody.id,
            id: `${this.id}-confirm-btn`,
            classList: ['modal-btn', 'modal-confirm-btn'],
            content: '확인'
        });

        if(this.type === 'select') this.deleteBtn = new CommonElements.CustomButton({
            parentId: this.btnBody.id,
            id: `${this.id}-delete-btn`,
            classList: ['modal-btn', 'modal-delete-btn'],
            content: '삭제'
        });

        this.cancelBtn = new CommonElements.CustomButton({
            parentId: this.btnBody.id,
            id: `${this.id}-cancel-btn`,
            classList: ['modal-btn', 'modal-cancel-btn'],
            content: '취소'
        });

        this.hide();
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get modal() {
        return this._modal;
    }

    set modal(value) {
        this._modal = value;
    }

    get header(){
        return this._header;
    }

    set header(value){
        this._header = value;
    }

    get title(){
        return this.header.elem.innerText;
    }

    set title(value){
        this.header.elem.innerText = value;
    }

    get body() {
        return this._body;
    }

    set body(value) {
        this._body = value;
    }

    get btnBody() {
        return this._btnBody;
    }

    set btnBody(value) {
        this._btnBody = value;
    }

    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value;
    }

    get select() {
        return this._select;
    }

    set select(value) {
        this._select = value;
    }

    get confirmBtn() {
        return this._confirmBtn;
    }

    set confirmBtn(value) {
        this._confirmBtn = value;
    }

    get deleteBtn() {
        return this._deleteBtn;
    }

    set deleteBtn(value) {
        this._deleteBtn = value;
    }

    get cancelBtn() {
        return this._cancelBtn;
    }

    set cancelBtn(value) {
        this._cancelBtn = value;
    }

    get content() {
        if(this.type === 'prompt') return this.input.elem.placeholder;
        else return this.body.elem.innerText;
    }

    set content(value) {
        if(this.type === 'prompt') this.input.elem.placeholder = value;
        else this.body.elem.innerText = value;
    }

    createBody(content) {
        this.body = new CommonElements.CustomElement({
            parentId: this.modal.id,
            id: `${this.id}-body`,
            tagName: 'div',
            classList: ['modal-body']
        });

        if(this.type === 'prompt'){
            this.input = new CommonElements.CustomInput({
                parentId: this.body.id,
                id: `${this.id}-input`,
                classList: ['modal-input']
            });
            this.input.elem.placeholder = content;
        } else if(this.type === 'select'){
            this.select = new CommonElements.CustomSelect({
                parentId: this.body.id,
                id: `${this.id}-select`,
                classList: ['modal-input'],
                options:{}
            });
        } else {
            this.body.elem.innerText = content;
        }
    }

    show() {
        this.elem.style.visibility = 'visible';
        this.modal.elem.style.height = '150px';
    }

    hide() {
        this.elem.style.visibility = 'hidden';
        this.modal.elem.style.height = '0px';
    }

    clickHandler() {
        this.cancelBtn?.clickHandler?.();
        this.hide();
    }

    set confirmHandler(value){
        this.confirmBtn.clickHandler = value;
    }

    set deleteHandler(value){
        this.deleteBtn.clickHandler = value;
    }

    set cancelHandler(value){
        this.cancelBtn.clickHandler = value;
    }
}