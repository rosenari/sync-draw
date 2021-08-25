import CustomElement from '../../CommonElement/CustomElement';
import { CommonElements } from '../../index';
import { Service } from '../../../service';
import {BOARD_ID, RATIO_TEXT_ID, BUTTON, MENU_BAR} from '../../../service/constant';
import './index.css';

export default class ZoomMenubar extends CustomElement{
    board = null;
    _ratioText = null;
    _zoomInBtn = null;
    _zoomOutBtn = null;

    constructor({parentId, board = Service.ComponentRepository.getComponentById(BOARD_ID)}) {
        super({
            parentId,
            id: MENU_BAR.ZOOM_MENU_BAR_ID,
            tagName: 'div',
            classList:['zoom-menu-bar']
        });
        this.board = board;

        this.ratioText = new CommonElements.CustomElement({
           parentId: this.id,
           id: RATIO_TEXT_ID,
           tagName: 'div',
           content: '100%',
           classList: ['ratio-text']
        });

        this.zoomInBtn = new CommonElements.CustomButton({
            parentId: this.id,
            id: BUTTON.ZOOM_IN_BTN_ID,
            content: '➕',
            classList:['zoom-btn'],
            handlers:{
                clickHandler: () => {
                    const scale = Service.TransformManager.scale + 0.25;
                    if(scale > 2) return;

                    this.zoom(scale);
                }
            }
        });

        this.zoomOutBtn = new CommonElements.CustomButton({
            parentId: this.id,
            id: BUTTON.ZOOM_OUT_BTN_ID,
            content: '➖',
            classList:['zoom-btn'],
            handlers:{
                clickHandler: () => {
                    const scale = Service.TransformManager.scale - 0.25;
                    if(scale < 0.25) return;

                    this.zoom(scale);
                }
            }
        });
    }

    zoom(scale){
        const centerX = (document.body.clientWidth) / 2;
        const centerY = (document.body.clientHeight) / 2;
        const translateX = (1-scale) * centerX + Service.TransformManager.moveX * scale;
        const translateY = (1-scale) * centerY + Service.TransformManager.moveY * scale;

        this.ratioText.elem.innerText = `${scale * 100}%`;
        this.board.destroyBorder();

        Service.TransformManager.translateX = translateX;
        Service.TransformManager.translateY = translateY;
        Service.TransformManager.scale = scale;
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