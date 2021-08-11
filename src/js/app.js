import ComponentRepository from './service/ComponentRepository';
import EventController from './service/EventController';
import Board from './component/Board';
import PageMenubar from './component/PageMenubar';
import ItemMenubar from './component/ItemMenubar';
import ZoomMenubar from './component/ZoomMenubar';
import StyleMenubar from './component/StyleMenubar';
import HistoryMenubar from './component/HistoryMenubar';
import CustomModal from "./component/CustomModal";

export default class App {
    _id = 'app';
    _elem = null;
    _board = null;
    _pageMenubar = null;
    _itemMenubar = null;
    _zoomMenubar = null;
    _styleMenubar = null;
    _historyMenubar = null;
    _promptModal = null;
    _confirmModal = null;
    _selectModal = null;
    _controller = null;

    constructor({ elem }) {
        this.elem = elem;
        ComponentRepository.setComponentById(this.id,this);

        this.board = new Board({
            parentId: this.id,
            classList: []
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

        this.styleMenubar.hide();

        this.historyMenubar = new HistoryMenubar({
            parentId: this.id
        });

        this.promptModal = new CustomModal({
            parentId: this.id,
            id: 'prompt-modal',
            type: 'prompt',
            content: '입력 모달'
        });

        this.confirmModal = new CustomModal({
            parentId: this.id,
            id: 'confirm-modal',
            type: 'confirm',
            content: '확인 모달'
        });

        this.selectModal = new CustomModal({
            parentId: this.id,
            id: 'select-modal',
            type: 'select',
            content: '선택 모달'
        });

        this.controller = new EventController(this.elem);
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get elem(){
        return this._elem;
    }

    set elem(value){
        this._elem = value;
    }

    get board() {
        return this._board;
    }

    set board(value) {
        this._board = value;
    }

    get pageMenubar() {
        return this._pageMenubar;
    }

    set pageMenubar(value) {
        this._pageMenubar = value;
    }

    get itemMenubar() {
        return this._itemMenubar;
    }

    set itemMenubar(value) {
        this._itemMenubar = value;
    }

    get zoomMenubar() {
        return this._zoomMenubar;
    }

    set zoomMenubar(value) {
        this._zoomMenubar = value;
    }

    get styleMenubar() {
        return this._styleMenubar;
    }

    set styleMenubar(value) {
        this._styleMenubar = value;
    }

    get historyMenubar() {
        return this._historyMenubar;
    }

    set historyMenubar(value) {
        this._historyMenubar = value;
    }

    get promptModal() {
        return this._promptModal;
    }

    set promptModal(value) {
        this._promptModal = value;
    }

    get confirmModal() {
        return this._confirmModal;
    }

    set confirmModal(value) {
        this._confirmModal = value;
    }

    get selectModal() {
        return this._selectModal;
    }

    set selectModal(value) {
        this._selectModal = value;
    }

    get controller() {
        return this._controller;
    }

    set controller(value) {
        this._controller = value;
    }
}
