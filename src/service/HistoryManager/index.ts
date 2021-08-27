import { ComponentRepository } from '../index';
import { deserialize, lineFirstSort } from '../util';
import {BEHAVIOR, HISTORY_VIEW_ID, MODAL, PHRASES} from '../constant';
import {HistoryView, Toast, Shape, CustomModal} from '../../component';

type HistoryItem = {
    behavior: string,
    type: string,
    svgElements: Array<string>
};

let instance: HistoryManager;
class HistoryManager {
    _history: Array<HistoryItem> = [];
    _historyIndex: number = -1;
    _currentPage: Array<string> = [];

    constructor() {
        setTimeout(() => this.restoreAutoStorePage());
    }

    public static getInstance(): HistoryManager {
        if(!instance) instance = new HistoryManager();
        return instance;
    }

    public get history(): Array<HistoryItem> {
        return this._history;
    }

    public set history(value: Array<HistoryItem>) {
        this._history = value;
        this.renderHistoryView();
    }

    public get historyIndex(): number {
        return this._historyIndex;
    }

    public set historyIndex(value: number) {
        this._historyIndex = value;
        this.renderHistoryView();
    }

    public get currentPage(): Array<string>{
        return this._currentPage;
    }

    public set currentPage(value: Array<string>){
        this._currentPage = value;
    }

    public undo() {
        const prevIndex = this.historyIndex - 1;
        this.commonDo(prevIndex);
    }

    public redo() {
        const nextIndex = this.historyIndex + 1;
        this.commonDo(nextIndex);
    }

    public commonDo(Index: number, toast: Toast = <Toast>ComponentRepository.getComponentById('toast')) {
        if(Index < -1){
            toast.content = PHRASES.NOT_EXIST_PREV_TASK;
            toast.show();
            return;
        }else if(Index > this.history.length - 1){
            toast.content = PHRASES.NOT_EXIST_NEXT_TASK;
            toast.show();
            return;
        }

        this.historyIndex = Index;
        ComponentRepository.removeSvgElements();
        if(this.history[Index]?.svgElements) {
            this.adjustSvgElements(this.history[Index].svgElements);
        }

        this.currentPage = ComponentRepository.getSvgElements();
        this.autoStoreCurrentPage();
    }

    public adjustSvgElements(svgElements: Array<string>) {
        lineFirstSort(svgElements);
        for (const json of svgElements) {
            deserialize(json);
        }
    }

    public initHistory(svgElements: Array<string>){
        this.historyIndex = 0;
        this.history = [{
            behavior: BEHAVIOR.INIT,
            type: 'All',
            svgElements
        }];
    }

    public removeLatestHistory(){
        const deleted = this.history.splice(this.historyIndex);
        if(deleted.length > 0){
            this.historyIndex -= 1;
        }
    }

    public updateHistoryToLatest(params: { behavior: string, type: string }) {
        const { behavior, type } = params;
        const svgElements = ComponentRepository.getSvgElements();
        const nextIndex = this.historyIndex + 1;
        if(this.history.length > 0) this.history.splice(nextIndex);
        this.history.push({
            behavior,
            type,
            svgElements
        });
        this.historyIndex = nextIndex;

        this.currentPage = svgElements;
        this.autoStoreCurrentPage();
    }

    public autoStoreCurrentPage() {
        const storeData = JSON.stringify(this.currentPage);
        localStorage.setItem('auto', storeData);
    }

    public storeCurrentPage(name: string){
        const storeData = this.currentPage;
        const prevStoreData = localStorage.getItem('storeData');
        if(prevStoreData){
            const parsePrevStoreData = JSON.parse(prevStoreData).filter(data => data.name !== name);
            localStorage.setItem('storeData', JSON.stringify([
                ...parsePrevStoreData,
                {
                    name,
                    data:storeData
                }
            ]));
            return;
        }
        localStorage.setItem('storeData', JSON.stringify([{
            name,
            data: storeData
        }]));
    }

    public restoreAutoStorePage(modal: CustomModal = <CustomModal>ComponentRepository.getComponentById(MODAL.CONFIRM_MODAL_ID)){
        const autoStoreData = localStorage.getItem('auto');
        if(autoStoreData) {
            modal.title = '⏰ 자동저장내역 복구';
            modal.content = PHRASES.AUTO_RESTORE;
            modal.confirmHandler = () => {
                const svgElements = JSON.parse(autoStoreData);
                this.adjustSvgElements(svgElements);
                this.initHistory(svgElements);
                modal.hide();
            }
            modal.cancelHandler = () => {
                localStorage.removeItem('auto');
                modal.hide();
            }
            modal.show();
        }
    }

    public restorePage(name: string, toast: Toast = <Toast>ComponentRepository.getComponentById('toast')){
        const prevStoreData = localStorage.getItem('storeData');
        if(!prevStoreData){
            toast.content = PHRASES.NOT_EXIST_STORE;
            toast.show();
            return;
        }
        const parsePrevStoreData = JSON.parse(prevStoreData).find(data => data.name === name);
        if(!parsePrevStoreData){
            toast.content = PHRASES.NOT_EXIST_NAME_STORE;
            toast.show();
            return;
        }

        const svgElements = parsePrevStoreData.data;
        ComponentRepository.removeSvgElements();
        this.adjustSvgElements(svgElements);
        this.initHistory(svgElements);

        this.currentPage = svgElements;
        this.autoStoreCurrentPage();
    }

    public deletePage(name: string){
        const prevStoreData = localStorage.getItem('storeData');
        if(prevStoreData){
            const parsePrevStoreData = JSON.parse(prevStoreData).filter(data => data.name !== name);
            localStorage.setItem('storeData', JSON.stringify(parsePrevStoreData));
        }
    }

    public isStoreName(name: string) {
        const prevStoreData = localStorage.getItem('storeData');
        if(!prevStoreData) return false;

        const storeData = JSON.parse(prevStoreData);
        return storeData.find(data => data.name === name);
    }

    public getStoreNames(): { [key: string]: string } {
        const result = {};
        const prevStoreData = localStorage.getItem('storeData');
        if(!prevStoreData) return result;

        const storeData = JSON.parse(prevStoreData);
        for(const data of storeData){
            result[data.name] = data.name;
        }

        return result;
    }

    public clearHistory(){
        this.historyIndex = -1;
        this.history = [];
    }

    public clearCurrentPage(){
        ComponentRepository.removeSvgElements();
        this.currentPage = [];
        localStorage.removeItem('auto');
    }

    public clear(){
        this.clearHistory();
        this.clearCurrentPage();
    }

    public renderHistoryView(historyView: HistoryView = <HistoryView>ComponentRepository.getComponentById(HISTORY_VIEW_ID)){
        historyView.list = this.history;
        historyView.currentIndex = this.historyIndex;
    }
}

export default HistoryManager.getInstance();