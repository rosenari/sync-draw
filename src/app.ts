import {
    Board, CustomModal, HistoryMenubar, HistoryView, ItemMenubar, PageMenubar, StyleMenubar, Toast, ZoomMenubar
} from './component';
import {ComponentRepository, EventController} from './service';
import { APP_ID, HISTORY_VIEW_ID, MODAL, TOAST_ID } from './service/constant';

export default class App {
    _id: string = APP_ID;
    _elem: HTMLElement = null;
    _board: Board = null;
    _pageMenubar: PageMenubar = null;
    _itemMenubar: ItemMenubar  = null;
    _zoomMenubar: ZoomMenubar = null;
    _styleMenubar: StyleMenubar = null;
    _historyMenubar: HistoryMenubar = null;
    _promptModal: CustomModal = null;
    _confirmModal: CustomModal = null;
    _selectModal: CustomModal = null;
    _toast: Toast = null;
    _historyView: HistoryView = null;
    _controller: EventController = null;

    constructor({ elem } : { elem: HTMLElement }) {
        this.elem = elem;
        ComponentRepository.setComponentById(this.id, this);

        this.board = new Board({
            parentId: this.id,
            classList: []
        });

        const modals = [
            {
                id : MODAL.PROMPT_MODAL_ID,
                type : 'prompt',
                content : '입력 모달'
            },
            {
                id: MODAL.CONFIRM_MODAL_ID,
                type: 'confirm',
                content: '확인 모달'
            },
            {
                id: MODAL.SELECT_MODAL_ID,
                type: 'select',
                content: '선택 모달'
            }
        ];

        modals.map(modal => this.createModal(modal)).forEach(modal => this.registerModal(modal));

        this.toast = new Toast({
            parentId: this.id,
            id: TOAST_ID
        });

        this.pageMenubar = new PageMenubar({
            parentId: this.id
        });

        this.itemMenubar = new ItemMenubar({
            parentId: this.id
        });

        this.zoomMenubar = new ZoomMenubar({
            parentId: this.id
        });

        this.styleMenubar = new StyleMenubar({
            parentId: this.id
        });

        this.historyMenubar = new HistoryMenubar({
            parentId: this.id
        });

        this.styleMenubar.hide();

        this.historyView = new HistoryView({
            parentId: this.id,
            id: HISTORY_VIEW_ID
        });

        this.controller = new EventController(this.elem);
    }

    createModal({ id, type, content}): CustomModal{
        return new CustomModal({
            parentId: this.id,
            id,
            type,
            content
        })
    }

    registerModal(modal): void{
        this[`${modal.type}Modal`] = modal;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get elem(): HTMLElement{
        return this._elem;
    }

    set elem(value: HTMLElement){
        this._elem = value;
    }

    get board(): Board {
        return this._board;
    }

    set board(value: Board) {
        this._board = value;
    }

    get pageMenubar(): PageMenubar {
        return this._pageMenubar;
    }

    set pageMenubar(value: PageMenubar) {
        this._pageMenubar = value;
    }

    get itemMenubar(): ItemMenubar {
        return this._itemMenubar;
    }

    set itemMenubar(value: ItemMenubar) {
        this._itemMenubar = value;
    }

    get zoomMenubar(): ZoomMenubar {
        return this._zoomMenubar;
    }

    set zoomMenubar(value: ZoomMenubar) {
        this._zoomMenubar = value;
    }

    get styleMenubar(): StyleMenubar {
        return this._styleMenubar;
    }

    set styleMenubar(value: StyleMenubar) {
        this._styleMenubar = value;
    }

    get historyMenubar(): HistoryMenubar {
        return this._historyMenubar;
    }

    set historyMenubar(value: HistoryMenubar) {
        this._historyMenubar = value;
    }

    get promptModal(): CustomModal {
        return this._promptModal;
    }

    set promptModal(value: CustomModal) {
        this._promptModal = value;
    }

    get confirmModal(): CustomModal {
        return this._confirmModal;
    }

    set confirmModal(value: CustomModal) {
        this._confirmModal = value;
    }

    get toast(): Toast{
        return this._toast;
    }

    set toast(value: Toast){
        this._toast = value;
    }

    get selectModal(): CustomModal {
        return this._selectModal;
    }

    set selectModal(value: CustomModal) {
        this._selectModal = value;
    }

    get historyView(): HistoryView {
        return this._historyView;
    }

    set historyView(value: HistoryView) {
        this._historyView = value;
    }

    get controller(): EventController {
        return this._controller;
    }

    set controller(value: EventController) {
        this._controller = value;
    }
}
