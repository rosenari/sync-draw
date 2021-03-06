import ComponentRepository from '../ComponentRepository';
import { deserialize } from '../util';
import {BEHAVIOR, COMPONENT_TYPE, HISTORY_VIEW_ID, PHRASES} from '../constant';

let instance = null;
class HistoryManager {
    _history = [];
    _historyIndex = -1;
    _currentPage = [];

    constructor() {
        setTimeout(() => this.restoreAutoStorePage());
    }

    static getInstance() {
        if(!instance) instance = new HistoryManager();
        return instance;
    }

    get history() {
        return this._history;
    }

    set history(value) {
        this._history = value;
        this.renderHistoryView();
    }

    get historyIndex() {
        return this._historyIndex;
    }

    set historyIndex(value) {
        this._historyIndex = value;
        this.renderHistoryView();
    }

    get running() {
        return this._running;
    }

    set running(value) {
        this._running = value;
    }

    get currentPage(){
        return this._currentPage;
    }

    set currentPage(value){
        this._currentPage = value;
    }

    undo() {
        const prevIndex = this.historyIndex - 1;
        this.commonDo(prevIndex);
    }

    redo() {
        const nextIndex = this.historyIndex + 1;
        this.commonDo(nextIndex);
    }

    commonDo(Index) {
        const toast = ComponentRepository.getComponentById('toast');
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

    adjustSvgElements(svgElements){
        lineFirstSort(svgElements);
        for (const json of svgElements) {
            deserialize(json);
        }
    }

    initHistory(svgElements){
        this.historyIndex = 0;
        this.history = [{
            behavior: BEHAVIOR.INIT,
            type: 'All',
            svgElements
        }];
    }

    removeLatestHistory(){
        const deleted = this.history.splice(this.historyIndex);
        if(deleted.length > 0){
            this.historyIndex -= 1;
        }
    }

    updateHistoryToLatest({ behavior, type }) {
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

    autoStoreCurrentPage() {
        const storeData = JSON.stringify(this.currentPage);
        localStorage.setItem('auto', storeData);
    }

    storeCurrentPage(name){
        const storeData = this.currentPage;
        let prevStoreData = localStorage.getItem('storeData');
        if(prevStoreData){
            prevStoreData = JSON.parse(prevStoreData).filter(data => data.name !== name);
            localStorage.setItem('storeData', JSON.stringify([
                ...prevStoreData,
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

    restoreAutoStorePage(){
        const autoStoreData = localStorage.getItem('auto');
        if(autoStoreData) {
            const modal = ComponentRepository.getComponentById('confirm-modal');
            modal.title = '??? ?????????????????? ??????';
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

    restorePage(name){
        const prevStoreData = localStorage.getItem('storeData');
        const toast = ComponentRepository.getComponentById('toast');
        if(!prevStoreData){
            toast.content = PHRASES.NOT_EXIST_STORE;
            toast.show();
            return;
        }
        const storeData = JSON.parse(prevStoreData).find(data => data.name === name);
        if(!storeData){
            toast.content = PHRASES.NOT_EXIST_NAME_STORE;
            toast.show();
            return;
        }

        const svgElements = storeData.data;
        ComponentRepository.removeSvgElements();
        this.adjustSvgElements(svgElements);
        this.initHistory(svgElements);

        this.currentPage = svgElements;
        this.autoStoreCurrentPage();
    }

    deletePage(name){
        let prevStoreData = localStorage.getItem('storeData');
        if(prevStoreData){
            prevStoreData = JSON.parse(prevStoreData).filter(data => data.name !== name);
            localStorage.setItem('storeData', JSON.stringify(prevStoreData));
        }
    }


    isStoreName(name) {
        const prevStoreData = localStorage.getItem('storeData');
        if(!prevStoreData) return false;

        const storeData = JSON.parse(prevStoreData);
        return storeData.find(data => data.name === name);
    }

    getStoreNames() {
        const result = {};
        const prevStoreData = localStorage.getItem('storeData');
        if(!prevStoreData) return result;

        const storeData = JSON.parse(prevStoreData);
        for(const data of storeData){
            result[data.name] = data.name;
        }

        return result;
    }

    clearHistory(){
        this.historyIndex = -1;
        this.history = [];
    }

    clearCurrentPage(){
        ComponentRepository.removeSvgElements();
        this.currentPage = [];
        localStorage.removeItem('auto');
    }

    clear(){
        this.clearHistory();
        this.clearCurrentPage();
    }

    renderHistoryView(){
        const historyView = ComponentRepository.getComponentById(HISTORY_VIEW_ID);
        historyView.list = this.history;
        historyView.currentIndex = this.historyIndex;
    }
}

function lineFirstSort(elements) {
    elements.sort((A, B) => {
        const svgA = JSON.parse(A);
        const svgB = JSON.parse(B);
        if(svgA.type !== COMPONENT_TYPE.GLine && !svgB.type === COMPONENT_TYPE.GLine) {
            return 1;
        } else if(svgA.type === COMPONENT_TYPE.GLine && !svgB.type !== COMPONENT_TYPE.GLine){
            return -1;
        }
        return 0;
    });
}

export default HistoryManager.getInstance();