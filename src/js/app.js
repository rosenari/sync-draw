import ComponentRepository from './service/ComponentRepository';
import EventController from './service/EventController';
import Board from './component/Board';
import PageMenubar from './component/PageMenubar';

export default class App {
    _id = 'app';
    _elem = null;
    _board = null;
    _pageMenubar = null;
    _controller = null;

    constructor({elem ,screenSize = { width: 1000, height: 1000 }}) {
        this.elem = elem;
        ComponentRepository.getInstance().setComponentById(this.id,this);

        this.board = new Board({
            parentId: this.id,
            classList: [],
            screenSize: {
                width: screenSize.width,
                height: screenSize.height
            },
            handlers: {
                clickHandler: function(e) {
                    console.log('board click !!');
                }
            }
        });

        this.pageMenubar = new PageMenubar({
            parentId: this.id
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

    get controller() {
        return this._controller;
    }

    set controller(value) {
        this._controller = value;
    }
}
