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
                board.border?.startPointInit?.();
                board.border?.moveHandler?.({ dx: -10, dy: 0 });
                board.border?.moveCompleteHandler();
            }else if(e.key === KEYEVENT.UP){
                board.border?.startPointInit?.();
                board.border?.moveHandler?.({ dx: 0, dy: -10 });
                board.border?.moveCompleteHandler();
            }else if(e.key === KEYEVENT.RIGHT){
                board.border?.startPointInit?.();
                board.border?.moveHandler?.({ dx: 10, dy: 0 });
                board.border?.moveCompleteHandler();
            }else if(e.key === KEYEVENT.DOWN){
                board.border?.startPointInit?.();
                board.border?.moveHandler?.({ dx: 0, dy: 10 });
                board.border?.moveCompleteHandler();
            }
        });
    }

}

export default KeyboardManager.getInstance();