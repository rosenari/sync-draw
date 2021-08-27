import { Board, PageMenubar, ZoomMenubar } from '../../component';
import { ComponentRepository, HistoryManager } from '../index';
import {BOARD_ID, KEYEVENT, MENU_BAR} from '../constant';

let instance: KeyboardManager = null;
class KeyboardManager {

    constructor() {}

    public static getInstance(): KeyboardManager {
        if (!instance) instance = new KeyboardManager();
        return instance;
    }

    public eventInit({ board = <Board>ComponentRepository.getComponentById(BOARD_ID),
              pageMenubar = <PageMenubar>ComponentRepository.getComponentById(MENU_BAR.PAGE_MENU_BAR_ID),
              zoomMenubar = <ZoomMenubar>ComponentRepository.getComponentById(MENU_BAR.ZOOM_MENU_BAR_ID)}
                  : { board?: Board, pageMenubar?: PageMenubar, zoomMenubar?: ZoomMenubar }): void {
        const moveOffset = 10;
        window.addEventListener('keydown', (e) => {
            if(e.ctrlKey && e.key === 'z'){
                HistoryManager.undo();
            }else if(e.ctrlKey && e.key === 'x'){
                HistoryManager.redo();
            }else if(e.ctrlKey && e.key === 'n'){
                pageMenubar.newBtn.clickHandler();
            }else if(e.ctrlKey && e.key === 's'){
                pageMenubar.saveBtn.clickHandler();
            }else if(e.ctrlKey && e.key === 'f'){
                pageMenubar.loadBtn.clickHandler();
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

        window.addEventListener('mousewheel', (e: WheelEvent) => {
            if(e.ctrlKey){
                if(e.deltaY < 0) { //down
                    zoomMenubar.zoomOutBtn.clickHandler();
                }else { //up
                    zoomMenubar.zoomInBtn.clickHandler();
                }
            }
        });
    }

    protected moveHandler({ board, dx, dy }: { board: Board, dx: number, dy: number }): void{
        board.border?.startPointInit?.();
        board.border?.moveHandler?.({ dx, dy });
        board.border?.moveCompleteHandler();
    }

}

export default KeyboardManager.getInstance();