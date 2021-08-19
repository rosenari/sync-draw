import CustomElement from '../CustomElement';
import CustomButton from '../CustomButton';
import {BUTTON, MENU_BAR, MODAL, PHRASES} from '../../service/constant';
import ComponentRepository from '../../service/ComponentRepository';
import HistoryManager from '../../service/HistoryManager';
import './index.css';

export default class PageMenubar extends CustomElement{
    promptModal = null;
    confirmModal = null;
    selectModal = null;
    _newBtn = null;
    _saveBtn = null;
    _loadBtn = null;

    constructor({parentId,
                    confirmModal = ComponentRepository.getComponentById(MODAL.CONFIRM_MODAL_ID),
                    promptModal = ComponentRepository.getComponentById(MODAL.PROMPT_MODAL_ID),
                    selectModal = ComponentRepository.getComponentById(MODAL.SELECT_MODAL_ID)}){
        super({
            parentId,
            id: MENU_BAR.PAGE_MENU_BAR_ID,
            tagName: 'div',
            classList:['page-menu-bar']
        });
        this.confirmModal = confirmModal;
        this.promptModal = promptModal;
        this.selectModal = selectModal;

        //새 페이지 버튼
        this.newBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.PAGE_NEW_BTN_ID,
            content: '📄',
            classList:['page-btn','page-new-btn'],
            handlers:{
                clickHandler: (e) => {
                    this.confirmModal.title = '📄 새페이지';
                    this.confirmModal.content = PHRASES.INIT;
                    this.confirmModal.confirmHandler = () => {
                        HistoryManager.clear();
                        this.confirmModal.hide();
                    }
                    this.confirmModal.cancelHandler = () => {
                        this.confirmModal.hide();
                    }
                    this.confirmModal.show();
                }
            }});

        //저장하기 버튼
        this.saveBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.PAGE_SAVE_BTN_ID,
            content: '💾',
            classList:['page-btn','page-save-btn'],
            handlers:{
                clickHandler: (e) => {
                    this.promptModal.title = '💾 저장하기';
                    this.promptModal.content = PHRASES.STORE_NAME_INPUT;
                    this.promptModal.confirmHandler = () => {
                        const name = this.promptModal.input.elem.value;
                        if(!name){
                            this.promptModal.hide();
                            return;
                        }
                        if(HistoryManager.isStoreName(name)){
                            this.promptModal.hide();
                            this.confirmModal.title = '💾 덮어쓰기';
                            this.confirmModal.content = PHRASES.ALREADY_NAME;
                            this.confirmModal.confirmHandler = () => {
                                HistoryManager.storeCurrentPage(name);
                                this.confirmModal.hide();
                            }
                            this.confirmModal.cancelHandler = () => {
                                this.confirmModal.hide();
                            }
                            this.confirmModal.show();
                            return;
                        }
                        HistoryManager.storeCurrentPage(name);
                        this.promptModal.hide();
                    }
                    this.promptModal.cancelHandler = () => {
                        this.promptModal.hide();
                    }
                    this.promptModal.input.elem.value = '';
                    this.promptModal.show();
                }
            }});

        //불러오기 버튼
        this.loadBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.PAGE_LOAD_BTN_ID,
            content: '🔎',
            classList:['page-btn','page-load-btn'],
            handlers:{
                clickHandler: (e) => {
                    this.selectModal.title = '🔎 복구 및 삭제';
                    this.selectModal.confirmBtn.elem.innerText = '복구';
                    this.selectModal.select.options = {
                        [PHRASES.NAME_SELECT]: '',
                        ...HistoryManager.getStoreNames()
                    };
                    this.selectModal.confirmHandler = () => {
                        const name = this.selectModal.select.elem.value;
                        if(name) HistoryManager.restorePage(name);

                        this.selectModal.hide();
                    }
                    this.selectModal.deleteHandler = () => {
                        const name = this.selectModal.select.elem.value;
                        if(name) HistoryManager.deletePage(name);
                        this.selectModal.hide();
                    }
                    this.selectModal.cancelHandler = () => {
                        this.selectModal.hide();
                    }
                    this.selectModal.show();
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