import ComponentRepository from './service/ComponentRepository';
import EventController from './service/EventController';
import Board from './component/Board';

export default class App {
    id = 'app';
    elem = null;
    board = null;
    controller = null;

    constructor({elem ,screenSize = { width: 1000, height: 1000 }}) {
        this.setElem(elem);
        ComponentRepository.getInstance().setComponentById(this.getId(),this);

        this.setBoard(new Board({
            parentId: this.getId(),
            classList: [],
            screenSize: {
                width: screenSize.width,
                height: screenSize.height
            }
        }));

        this.setController(new EventController(this.getElem()));
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    getElem(){
        return this.elem;
    }

    setElem(elem){
        this.elem = elem;
    }

    setBoard(board){
        this.board = board;
    }

    getBoard(){
        return this.board;
    }

    setController(controller){
        this.controller = controller;
    }

    getController(){
        return this.controller;
    }
}
