import ComponentRepository from '../ComponentRepository';
import {deserialize} from "../util";

let instance = null;
class HistoryManager {
    _running = false; //mutex
    _history = [];
    _historyIndex = -1;

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

    get historyIndex(){
        return this._historyIndex;
    }

    set historyIndex(value){
        this._historyIndex = value;
    }

    get running(){
        return this._running;
    }

    set running(value){
        this._running = value;
    }

    async undo() {
        if(this.running) return;
        this.running = true;
        const prevIndex = this.historyIndex - 1;
        await this.commonDo(prevIndex);
        this.running = false;
    }

    async redo() {
        if(this.running) return;
        this.running = true;
        const nextIndex = this.historyIndex + 1;
        await this.commonDo(nextIndex);
        this.running = false;
    }

    async commonDo(Index){
        if(Index < -1){
            alert('이전 작업이 없습니다.');
            this.running = false;
            return;
        }else if(Index > this.history.length - 1){
            alert('다음 작업이 없습니다.');
            this.running = false;
            return;
        }

        this.historyIndex = Index;
        ComponentRepository.removeSvgElements();
        if(this.history[Index]?.svgElements) {
            lineFirstSort(this.history[Index]?.svgElements);
            for (const json of this.history[Index]?.svgElements) {
                await deserialize(json);
            }
        }
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
    }
}

function lineFirstSort(elements){
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