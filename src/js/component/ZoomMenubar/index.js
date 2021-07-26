import CustomElement from '../CustomElement';
import CustomButton from '../CustomButton';
import TransformManager from '../../service/TransformManager';
import './index.css';
import ComponentRepository from '../../service/ComponentRepository';

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
                clickHandler: (e) => {
                    const board = ComponentRepository.getComponentById('board');
                    const centerX = document.body.clientWidth / 2;
                    const centerY = document.body.clientHeight / 2;
                    const scale = TransformManager.scale + 0.25;
                    if(scale > 2) return;
                    const translateX = (1-scale) * centerX;
                    const translateY = (1-scale) * centerY;
                    this.ratioText.elem.innerText = `${scale * 100}%`;
                    board.destroyBorder();

                    TransformManager.translateX = translateX;
                    TransformManager.translateY = translateY;
                    TransformManager.scale = scale;
                }
            }
        });

        this.zoomOutBtn = new CustomButton({
            parentId: this.id,
            id: 'zoom-out-btn',
            content: '➖',
            classList:['zoom-btn'],
            handlers:{
                clickHandler: (e) => {
                    const board = ComponentRepository.getComponentById('board');
                    const centerX = document.body.clientWidth / 2;
                    const centerY = document.body.clientHeight / 2;
                    const scale = TransformManager.scale - 0.25;
                    if(scale < 0.25) return;
                    this.ratioText.elem.innerText = `${scale * 100}%`;
                    board.destroyBorder();
                    const translateX = (1-scale) * centerX;
                    const translateY = (1-scale) * centerY;

                    TransformManager.translateX = translateX;
                    TransformManager.translateY = translateY;
                    TransformManager.scale = scale;
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