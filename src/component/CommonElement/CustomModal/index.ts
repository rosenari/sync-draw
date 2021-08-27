import CustomElement from '../CustomElement';
import {Component, CustomButton, CustomInput, CustomSelect} from '../../index';
import { ClickElement } from '../../../interface';
import './index.css';
import Shape from "../../Shape";

export default class CustomModal extends CustomElement implements ClickElement{
    private _type: string = null;
    private _modal: CustomElement = null;
    private _header: CustomElement = null;
    private _body: CustomElement = null;
    private _btnBody: CustomElement = null;
    private _input: CustomInput = null;
    private _select: CustomSelect = null;
    private _confirmBtn: CustomButton = null;
    private _deleteBtn: CustomButton = null;
    private _cancelBtn: CustomButton = null;

    constructor({ parentId, id, type = 'confirm', title = '타이틀', content }: {
        parentId: string;
        id: string;
        type?: string;
        title?: string;
        content?: string;
    }) {
        super({
            parentId,
            id,
            tagName:'div',
            classList:['modal-background']
        });

        this.type = type;
        this.modal = new CustomElement({
            parentId:this.id,
            id:`${this.id}-modal`,
            tagName:'div',
            classList:['modal']
        });

        this.header = new CustomElement({
            parentId: this.modal.id,
            id: `${this.id}-title`,
            tagName: 'div',
            classList: ['modal-title']
        });

        (<HTMLElement>this.header.elem).innerText = title;

        this.createBody(content);

        this.btnBody = new CustomElement({
            parentId:this.modal.id,
            id:`${this.id}-modal-btn-body`,
            tagName:'div',
            classList:['modal-btn-body']
        });

        this.confirmBtn = new CustomButton({
            parentId: this.btnBody.id,
            id: `${this.id}-confirm-btn`,
            classList: ['modal-btn', 'modal-confirm-btn'],
            content: '확인'
        });

        if(this.type === 'select') this.deleteBtn = new CustomButton({
            parentId: this.btnBody.id,
            id: `${this.id}-delete-btn`,
            classList: ['modal-btn', 'modal-delete-btn'],
            content: '삭제'
        });

        this.cancelBtn = new CustomButton({
            parentId: this.btnBody.id,
            id: `${this.id}-cancel-btn`,
            classList: ['modal-btn', 'modal-cancel-btn'],
            content: '취소'
        });

        this.hide();
    }

    public get type(): string {
        return this._type;
    }

    public set type(value: string) {
        this._type = value;
    }

    public get modal(): CustomElement {
        return this._modal;
    }

    public set modal(value: CustomElement) {
        this._modal = value;
    }

    public get header(): CustomElement{
        return this._header;
    }

    public set header(value: CustomElement){
        this._header = value;
    }

    public get title(): string{
        return (<HTMLElement>this.header.elem).innerText;
    }

    public set title(value: string){
        (<HTMLElement>this.header.elem).innerText = value;
    }

    public get body(): CustomElement {
        return this._body;
    }

    public set body(value: CustomElement) {
        this._body = value;
    }

    public get btnBody(): CustomElement {
        return this._btnBody;
    }

    public set btnBody(value: CustomElement) {
        this._btnBody = value;
    }

    public get input(): CustomInput {
        return this._input;
    }

    public set input(value: CustomInput) {
        this._input = value;
    }

    public get select(): CustomSelect {
        return this._select;
    }

    public set select(value: CustomSelect) {
        this._select = value;
    }

    public get confirmBtn(): CustomButton {
        return this._confirmBtn;
    }

    public set confirmBtn(value: CustomButton) {
        this._confirmBtn = value;
    }

    public get deleteBtn(): CustomButton {
        return this._deleteBtn;
    }

    public set deleteBtn(value: CustomButton) {
        this._deleteBtn = value;
    }

    public get cancelBtn(): CustomButton {
        return this._cancelBtn;
    }

    public set cancelBtn(value: CustomButton) {
        this._cancelBtn = value;
    }

    public get content() {
        if(this.type === 'prompt') return (<HTMLInputElement>this.input.elem).placeholder;
        else return (<HTMLElement>this.body.elem).innerText;
    }

    public set content(value: string) {
        if(this.type === 'prompt') (<HTMLInputElement>this.input.elem).placeholder = value;
        else (<HTMLElement>this.body.elem).innerText = value;
    }

    public createBody(content: string) {
        this.body = new CustomElement({
            parentId: this.modal.id,
            id: `${this.id}-body`,
            tagName: 'div',
            classList: ['modal-body']
        });

        if(this.type === 'prompt'){
            this.input = new CustomInput({
                parentId: this.body.id,
                id: `${this.id}-input`,
                classList: ['modal-input']
            });
            (<HTMLInputElement>this.input.elem).placeholder = content;
        } else if(this.type === 'select'){
            this.select = new CustomSelect({
                parentId: this.body.id,
                id: `${this.id}-select`,
                classList: ['modal-input'],
                options:{}
            });
        } else {
            (<HTMLElement>this.body.elem).innerText = content;
        }
    }

    public show() {
        (<HTMLElement>this.elem).style.visibility = 'visible';
        (<HTMLElement>this.modal.elem).style.height = '150px';
    }

    public hide() {
        (<HTMLElement>this.elem).style.visibility = 'hidden';
        (<HTMLElement>this.modal.elem).style.height = '0px';
    }

    public clickHandler() {
        this.cancelBtn?.clickHandler?.();
        this.hide();
    }

    public set confirmHandler(value: (e?: MouseEvent, component?: Component) => void){
        this.confirmBtn.clickHandler = value;
    }

    public set deleteHandler(value: (e?: MouseEvent, component?: Component) => void){
        this.deleteBtn.clickHandler = value;
    }

    public set cancelHandler(value: (e?: MouseEvent, component?: Component) => void){
        this.cancelBtn.clickHandler = value;
    }
}