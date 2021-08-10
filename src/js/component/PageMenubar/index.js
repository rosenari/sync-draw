import CustomElement from '../CustomElement';
import CustomButton from '../CustomButton';
import {BUTTON, MENU_BAR} from '../../service/constant';
import HistoryManager from '../../service/HistoryManager';
import './index.css';

export default class PageMenubar extends CustomElement{
    _newBtn = null;
    _saveBtn = null;
    _loadBtn = null;

    constructor({parentId}){
        super({
            parentId,
            id: MENU_BAR.PAGE_MENU_BAR_ID,
            tagName: 'div',
            classList:['page-menu-bar']
        });

        //새 페이지 버튼
        this.newBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.PAGE_NEW_BTN_ID,
            content: '📄',
            classList:['page-btn','page-new-btn'],
            handlers:{
                clickHandler: function(e){
                    const answer = confirm('정말 초기화 하시겠습니까 ?'); //커스텀 모달로 교체예정
                    if(answer) HistoryManager.clear();
                }
            }});

        //저장하기 버튼
        this.saveBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.PAGE_SAVE_BTN_ID,
            content: '💾',
            classList:['page-btn','page-save-btn'],
            handlers:{
                clickHandler: function(e){
                    const name = prompt('어떤이름으로 저장하시겠습니까 ?'); //커스텀 모달로 교체예정
                    if(!name) return;

                    if(HistoryManager.isStoreName(name)){
                        const answer = confirm('이미 존재하는 이름입니다. 덮어쓰시겠습니까 ?'); //커스텀 모달로 교체예정
                        if(!answer) return;
                    }

                    HistoryManager.storeCurrentPage(name);
                }
            }});

        //불러오기 버튼
        this.loadBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.PAGE_LOAD_BTN_ID,
            content: '🔎',
            classList:['page-btn','page-load-btn'],
            handlers:{
                clickHandler: function(e){
                    const name = prompt('복구할 저장내역 이름을 입력하세요.'); //커스텀 모달로 교체예정
                    if(!name) return;

                    HistoryManager.restorePage(name);
                }
            }});
    }

    set newBtn(value) {
        this._newBtn = value;
    }

    set saveBtn(value) {
        this._saveBtn = value;
    }

    set loadBtn(value) {
        this._loadBtn = value;
    }

    get newBtn() {
        return this._newBtn;
    }

    get saveBtn() {
        return this._saveBtn;
    }

    get loadBtn() {
        return this._loadBtn;
    }
}