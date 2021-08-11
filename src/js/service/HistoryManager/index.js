import ComponentRepository from '../ComponentRepository';
import { deserialize } from "../util";

let instance = null;
class HistoryManager {
    _running = false; //mutex
    _history = [];
    _historyIndex = -1;
    _currentPage = [];

    constructor() {
        this.restoreAutoStorePage();
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
    }

    get historyIndex() {
        return this._historyIndex;
    }

    set historyIndex(value) {
        this._historyIndex = value;
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

    async undo() {
        const prevIndex = this.historyIndex - 1;
        await this.commonDo(prevIndex);
    }

    async redo() {
        const nextIndex = this.historyIndex + 1;
        await this.commonDo(nextIndex);
    }

    async commonDo(Index) {
        if(this.running) return;
        this.running = true;
        if(Index < -1){
            alert('이전 작업이 없습니다.'); //커스텀 모달로 교체예정
            this.running = false;
            return;
        }else if(Index > this.history.length - 1){
            alert('다음 작업이 없습니다.'); //커스텀 모달로 교체예정
            this.running = false;
            return;
        }

        this.historyIndex = Index;
        ComponentRepository.removeSvgElements();
        if(this.history[Index]?.svgElements) {
            await this.adjustSvgElements(this.history[Index].svgElements);
        }
        this.running = false;
    }

    async adjustSvgElements(svgElements){
        lineFirstSort(svgElements);
        for (const json of svgElements) {
            await deserialize(json);
        }
    }

    initHistory(svgElements){
        this.historyIndex = 0;
        this.history = [{
            behavior: 'init',
            type: 'All',
            svgElements
        }];
    }

    updateHistoryToLatest({ behavior, type }) {
        const svgElements = ComponentRepository.getSvgElements();
        const nextIndex = this.historyIndex + 1;
        this.history.splice(nextIndex);
        this.historyIndex = nextIndex;
        this.history.push({
            behavior,
            type,
            svgElements
        });

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

    async restoreAutoStorePage(){
        this.running = true;
        const autoStoreData = localStorage.getItem('auto');
        if(autoStoreData) {
            const svgElements = JSON.parse(autoStoreData);
            await this.adjustSvgElements(svgElements);
            this.initHistory(svgElements);
        }
        this.running = false;
    }

    async restorePage(name){
        if(this.running) return;
        this.running = true;
        const prevStoreData = localStorage.getItem('storeData');
        if(!prevStoreData){
            alert('저장내역이 존재하지 않습니다.'); //커스텀 모달로 교체예정
            this.running = false;
            return;
        }
        const storeData = JSON.parse(prevStoreData).find(data => data.name === name);
        if(!storeData){
            alert('해당이름의 저장내역이 존재하지 않습니다.'); //커스텀 모달로 교체예정
            this.running = false;
            return;
        }

        const svgElements = storeData.data;
        ComponentRepository.removeSvgElements();
        await this.adjustSvgElements(svgElements);
        this.initHistory(svgElements);

        this.currentPage = svgElements;
        this.autoStoreCurrentPage();
        this.running = false;
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
}

function lineFirstSort(elements) {
    elements.sort((A, B) => {
        const svgA = JSON.parse(A);
        const svgB = JSON.parse(B);
        if(svgA.type?.[1] !== 'Line' && !svgB.type?.[1] === 'Line') {
            return 1;
        }else if(svgA.type?.[1] === 'Line' && !svgB.type?.[1] !== 'Line'){
            return -1;
        }
        return 0;
    });
}

export default HistoryManager.getInstance();