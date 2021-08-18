import CustomElement from '../CustomElement';
import CustomButton from '../CustomButton';
import {BUTTON, MENU_BAR, MODAL, PHRASES} from '../../service/constant';
import ComponentRepository from '../../service/ComponentRepository';
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
                clickHandler: function(e,
                                       modal = ComponentRepository.getComponentById(MODAL.CONFIRM_MODAL_ID)){
                    modal.title = '📄 새페이지';
                    modal.content = PHRASES.INIT;
                    modal.confirmHandler = () => {
                        HistoryManager.clear();
                        modal.hide();
                    }
                    modal.cancelHandler = () => {
                        modal.hide();
                    }
                    modal.show();
                }
            }});

        //저장하기 버튼
        this.saveBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.PAGE_SAVE_BTN_ID,
            content: '💾',
            classList:['page-btn','page-save-btn'],
            handlers:{
                clickHandler: function(e, promptModal = ComponentRepository.getComponentById(MODAL.PROMPT_MODAL_ID),
                                       confirmModal = ComponentRepository.getComponentById(MODAL.CONFIRM_MODAL_ID)){
                    promptModal.title = '💾 저장하기';
                    promptModal.content = PHRASES.STORE_NAME_INPUT;
                    promptModal.confirmHandler = () => {
                        const name = promptModal.input.elem.value;
                        if(!name){
                            promptModal.hide();
                            return;
                        }
                        if(HistoryManager.isStoreName(name)){
                            promptModal.hide();
                            confirmModal.title = '💾 덮어쓰기';
                            confirmModal.content = PHRASES.ALREADY_NAME;
                            confirmModal.confirmHandler = () => {
                                HistoryManager.storeCurrentPage(name);
                                confirmModal.hide();
                            }
                            confirmModal.cancelHandler = () => {
                                confirmModal.hide();
                            }
                            confirmModal.show();
                            return;
                        }
                        HistoryManager.storeCurrentPage(name);
                        promptModal.hide();
                    }
                    promptModal.cancelHandler = () => {
                        promptModal.hide();
                    }
                    promptModal.input.elem.value = '';
                    promptModal.show();
                }
            }});

        //불러오기 버튼
        this.loadBtn = new CustomButton({
            parentId: this.id,
            id: BUTTON.PAGE_LOAD_BTN_ID,
            content: '🔎',
            classList:['page-btn','page-load-btn'],
            handlers:{
                clickHandler: function(e, modal = ComponentRepository.getComponentById(MODAL.SELECT_MODAL_ID)){
                    modal.title = '🔎 복구 및 삭제';
                    modal.confirmBtn.elem.innerText = '복구';
                    modal.select.options = {
                        [PHRASES.NAME_SELECT]: '',
                        ...HistoryManager.getStoreNames()
                    };
                    modal.confirmHandler = () => {
                        const name = modal.select.elem.value;
                        if(name) HistoryManager.restorePage(name);

                        modal.hide();
                    }
                    modal.deleteHandler = () => {
                        const name = modal.select.elem.value;
                        if(name) HistoryManager.deletePage(name);
                        modal.hide();
                    }
                    modal.cancelHandler = () => {
                        modal.hide();
                    }
                    modal.show();
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