import CustomElement from '../../CommonElement/CustomElement';
import CustomButton from '../../CommonElement/CustomButton';
import HistoryManager from '../../../service/HistoryManager';
import { MENU_BAR, BUTTON } from '../../../service/constant';
import './index.css';

export default class HistoryMenubar extends CustomElement{
    _undoBtn = null;
    _redoBtn = null;

    constructor({parentId}) {
        super({
            parentId,
            id: MENU_BAR.HISTORY_MENU_BAR_ID,
            tagName: 'div',
            classList:['history-menu-bar']
        });

        this.undoBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.HISTORY_UNDO_BTN_ID,
            content: '⟲️',
            classList:['history-btn'],
            handlers:{
                clickHandler: function(e){
                    HistoryManager.undo();
                }
            }
        });

        this.redoBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.HISTORY_REDO_BTN_ID,
            content: '⟳️️',
            classList:['history-btn'],
            handlers:{
                clickHandler: function(e){
                    HistoryManager.redo();
                }
            }
        });
    }

    get undoBtn() {
        return this._undoBtn;
    }

    set undoBtn(value) {
        this._undoBtn = value;
    }

    get redoBtn() {
        return this._redoBtn;
    }

    set redoBtn(value) {
        this._redoBtn = value;
    }
}