import CustomElement from '../CustomElement';
import CustomButton from '../CustomButton';
import './index.css';

export default class HistoryMenubar extends CustomElement{
    _undoBtn = null;
    _redoBtn = null;

    constructor({parentId}) {
        super({
            parentId,
            id: 'history-menu-bar',
            tagName: 'div',
            classList:['history-menu-bar']
        });

        this.undoBtn = new CustomButton({
            parentId: this.id,
            id: 'history-undo-btn',
            content: '↩️',
            classList:['history-btn'],
            handlers:{
                clickHandler: function(e){
                    console.log('undo button !');
                }
            }
        });

        this.redoBtn = new CustomButton({
            parentId: this.id,
            id: 'history-redo-btn',
            content: '↪️️',
            classList:['history-btn'],
            handlers:{
                clickHandler: function(e){
                    console.log('redo button !');
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