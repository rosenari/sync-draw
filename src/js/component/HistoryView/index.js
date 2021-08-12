import CustomElement from '../CustomElement';
import { ComponentKor } from '../index';
import './index.css';

export default class HistoryView extends CustomElement{
    _list = [];
    _currentIndex = 0;
    constructor({parentId, id}) {
        super({
            parentId,
            id,
            tagName: 'div',
            classList: ['history-view']
        });
    }

    get list() {
        return this._list;
    }

    set list(value) {
        this._list = value;
        this.render();
    }

    get currentIndex(){
        return this._currentIndex;
    }

    set currentIndex(value){
        this._currentIndex = value;
        this.render();
    }

    render() {
        this.elem.innerHTML = '';
        let currentIndexElemTop = 0;
        this.list.forEach((data, index) => {
            const historyBox = document.createElement('div');
            historyBox.classList.add('history-box');
            if(index === this.currentIndex) historyBox.classList.add('active');

            const behavior = document.createElement('div');
            behavior.classList.add('behavior');
            behavior.innerText = data.behavior;

            const type = document.createElement('div');
            type.innerText = ComponentKor[data.type];

            historyBox.appendChild(behavior);
            historyBox.appendChild(type);
            this.elem.appendChild(historyBox);

            if(index === this.currentIndex) currentIndexElemTop = historyBox.offsetTop;
        });
        if(currentIndexElemTop - 50 < 0) this.elem.scrollTop = 10;
        else this.elem.scrollTop = currentIndexElemTop - 50;
    }


}