import CustomElement from '../CustomElement';
import CustomButton from '../CustomButton';
import './index.css';

export default class ZoomMenubar extends CustomElement{
    _ratioText = null;
    _zoomInBtn = null;
    _zoomOutBtn = null;

    constructor({parentId}) {
        super({
            parentId,
            id: 'zoom-menu-bar',
            tagName: 'div',
            classList:['zoom-menu-bar']
        });

        this.ratioText = new CustomElement({
           parentId: this.id,
           id: 'ratio-text',
           tagName: 'div',
           content: '100%',
           classList: ['ratio-text']
        });

        this.zoomInBtn = new CustomButton({
            parentId: this.id,
            id: 'zoom-in-btn',
            content: '➕',
            classList:['zoom-btn'],
            handlers:{
                clickHandler: function(e){
                    console.log('zoom in button !');
                }
            }
        });

        this.zoomOutBtn = new CustomButton({
            parentId: this.id,
            id: 'zoom-out-btn',
            content: '➖',
            classList:['zoom-btn'],
            handlers:{
                clickHandler: function(e){
                    console.log('zoom out button !');
                }
            }
        });
    }

    get ratioText() {
        return this._ratioText;
    }

    set ratioText(value) {
        this._ratioText = value;
    }

    get zoomInBtn() {
        return this._zoomInBtn;
    }

    set zoomInBtn(value) {
        this._zoomInBtn = value;
    }

    get zoomOutBtn() {
        return this._zoomOutBtn;
    }

    set zoomOutBtn(value) {
        this._zoomOutBtn = value;
    }
}