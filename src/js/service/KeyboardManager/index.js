import HistoryManager from '../HistoryManager';
import ComponentRepository from '../ComponentRepository';
import {BOARD_ID, KEYEVENT, MENU_BAR} from "../constant";

let instance = null;
class KeyboardManager {

    constructor() {}

    static getInstance() {
        if (!instance) instance = new KeyboardManager();
        return instance;
    }

    eventInit(){
        window.addEventListener('keydown', (e) => {
            const board = ComponentRepository.getComponentById(BOARD_ID);
            const pageMenuBar = ComponentRepository.getComponentById(MENU_BAR.PAGE_MENU_BAR_ID);
            const moveOffset = 10;
            if(e.ctrlKey && e.key === 'z'){
                HistoryManager.undo();
            }else if(e.ctrlKey && e.key === 'x'){
                HistoryManager.redo();
            }else if(e.ctrlKey && e.key === 'n'){
                pageMenuBar.newBtn.clickHandler();
            }else if(e.ctrlKey && e.key === 's'){
                pageMenuBar.saveBtn.clickHandler();
            }else if(e.ctrlKey && e.key === 'f'){
                pageMenuBar.loadBtn.clickHandler();
            }else if(e.key === KEYEVENT.deleteKey){
                board.border?.deleteHandler?.();
            }else if(e.key === KEYEVENT.LEFT){
                this.moveHandler({ board, dx: -moveOffset, dy: 0 });
            }else if(e.key === KEYEVENT.UP){
                this.moveHandler({ board, dx: 0, dy: -moveOffset });
            }else if(e.key === KEYEVENT.RIGHT){
                this.moveHandler({ board, dx: moveOffset, dy: 0 });
            }else if(e.key === KEYEVENT.DOWN){
                this.moveHandler({ board, dx: 0, dy: moveOffset });
            }
        });
    }

    moveHandler({ board, dx, dy }){
        board.border?.startPointInit?.();
        board.border?.moveHandler?.({ dx, dy });
        board.border?.moveCompleteHandler();
    }

}

export default KeyboardManager.getInstance();