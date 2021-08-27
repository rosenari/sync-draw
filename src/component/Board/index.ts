import GraphicElement from '../CommonElement/GraphicElement';
import { ItemMenubar, StyleMenubar, LineBorder, SizeBorder, GroupBorder, GText, Line, Shape } from '../../component';
import { ComponentRepository, EventController, HistoryManager } from '../../service';
import { Group, Border } from '../index';
import { ButtonInfo } from '../Toolbar/ItemMenubar';
import {
    BOARD_ID,
    BORDER,
    COLOR,
    MENU_BAR,
    PLACE_HOLDER_ID,
    GROUP, BEHAVIOR
} from '../../service/constant';
import {tinyGUID, setDisablePointerEvent, Constructor} from '../../service/util';
import './index.css';

type BoardStartPoint = {
    x?: number;
    y?: number;
    translateX?: number;
    translateY?: number;
    moveX?: number;
    moveY?: number;
    lineplaceholder?: Line;
    line?: Line;
};

export default class Board extends GraphicElement {
    public static startPoint: BoardStartPoint;
    private _shapeGroup: Group = null;
    private _tempGroup: Group = null;
    private _border: Border = null;

    constructor({ parentId, content = '', classList = [], handlers = {}} : {
        parentId: string;
        content?: string;
        classList?: Array<string>;
        handlers?: {
            [key: string]: Function;
        }
    }) {
        super({ parentId, id: BOARD_ID, tagName: 'svg', content, classList, handlers});
        this.elem.setAttribute('style',`width: 100%; height: 100%;`);

        const groupList = [
            {
                id: GROUP.SHAPE_GROUP_ID,
                propsName: 'shapeGroup'
            },
            {
                id: GROUP.TEMP_GROUP_ID,
                propsName: 'tempGroup'
            }
        ];

        const registerGroup = (group: {
            id: string;
            propsName: string;
        }) => {
            this[`${group.propsName}`] = new Group({
               parentId: this.id,
               id: group.id
            });
        }

        groupList.forEach(registerGroup);

        this.elem.addEventListener('mousedown', (e: MouseEvent) => {
            if(e.shiftKey) return;
            this._mouseDownHandler(e);
        });
    }

    public get shapeGroup(): Group {
        return this._shapeGroup;
    }

    public set shapeGroup(value: Group) {
        this._shapeGroup = value;
    }

    public get tempGroup(): Group {
        return this._tempGroup;
    }

    public set tempGroup(value: Group) {
        this._tempGroup = value;
    }

    public get border(): Border {
        return this._border;
    }

    public set border(value: Border) {
        this._border = value;
    }

    private _mouseDownHandler(e: MouseEvent, itemMenubar: ItemMenubar = <ItemMenubar>ComponentRepository.getComponentById(MENU_BAR.ITEM_MENU_BAR_ID)) {
        setDisablePointerEvent(true);
        if(!Board.startPoint){
            Board.startPoint = {
                x: e.pageX,
                y: e.pageY
            }
        }else{
            Board.startPoint.x = e.pageX;
            Board.startPoint.y = e.pageY;
        }
        let selected: ButtonInfo = null;
        if(itemMenubar.selectMenu) {
            selected = <ButtonInfo>ComponentRepository.getComponentById(itemMenubar.selectMenu);
            selected.relatedMouseDownHandler(e);
        }

        //line생성이 종료된 경우 mouseBtn메뉴가 선택되기 떄문에 selected를 갱신할 필요가 있음.
        selected = <ButtonInfo>ComponentRepository.getComponentById(itemMenubar.selectMenu);

        EventController.mouseMoveHandler = (e: MouseEvent) => {
            this.renderBorder(e);
            selected.relatedMouseMoveHandler?.(e);
        }

        EventController.mouseUpHandler = (e: MouseEvent) => {
            selected.relatedMouseUpHandler?.(e);
        }
    }

    public createBorder(e: MouseEvent, type: Constructor<Border>, shape: Shape = null) {
        Board.startPoint = {
            x: e.pageX,
            y: e.pageY
        };
        this.border = new type({
            parentId: this.tempGroup.id,
            id: BORDER.BORDER_ID,
            shape
        });
        this.border.x = Board.startPoint.x;
        this.border.y = Board.startPoint.y;
    }

    public createSizeBorder(target: Shape){
        this.border = new SizeBorder({
            parentId: GROUP.TEMP_GROUP_ID,
            target
        });
    }

    public createLineBorder(target: Line){
        this.border = new LineBorder({
            parentId: GROUP.TEMP_GROUP_ID,
            target
        });
    }

    public createGroupBorder({ x, y, width, height, shapes,
                          styleMenubar = <StyleMenubar>ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID)}:{
        x: number;
        y: number;
        width: number;
        height: number;
        shapes: Array<Shape>;
        styleMenubar?: StyleMenubar
    }){
        this.border = new GroupBorder({
            parentId: this.tempGroup.id,
            id: BORDER.GROUP_BORDER_ID,
            x, y, width, height, shapes
        });

        styleMenubar.show();
    }

    public createShapePlaceHolder(type) {
        if(!type || type === GText) return null;

        const placeholder =  new type({
            parentId: this.shapeGroup.id,
            id: PLACE_HOLDER_ID
        });
        placeholder.elem.setAttribute('class','place-holder');
        return placeholder;
    }

    public createLinePlaceHolder(type: Constructor<Line>) {
        const placeholder = new type({
            parentId: this.shapeGroup.id,
            id: PLACE_HOLDER_ID,
            startX: Board.startPoint.x,
            startY: Board.startPoint.y
        });
        placeholder.line.elem.setAttribute('stroke',COLOR.ORANGE);
        placeholder.arrow?.elem.setAttribute('stroke','transparent');
        placeholder.arrow?.elem.setAttribute('fill',COLOR.ORANGE);
        placeholder.line.elem.setAttribute('stroke-dasharray', '6');
        placeholder.line.elem.setAttribute('class', 'place-holder');
        return placeholder;
    }

    public createShape(type: Constructor) {
        const shape = new type({
            parentId: this.shapeGroup.id,
            id: tinyGUID(),
            x: this.border.x,
            y: this.border.y,
            width: this.border.width,
            height: this.border.height
        });

        HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.CREATE, type:`${shape.type}` });

        return shape;
    }

    public createLine(type: Constructor<Line>) {
        return new type({
            parentId: this.shapeGroup.id,
            id: tinyGUID(),
            startX: Board.startPoint.x,
            startY: Board.startPoint.y,
        });
    }

    public renderBorder(e: MouseEvent) {
        if(!this.border) return;

        if(!Board.startPoint.x || !Board.startPoint.y) return;
        //이동한 변위
        const dx = e.pageX - Board.startPoint.x;
        const dy = e.pageY - Board.startPoint.y;
        //변화된 너비와와 높이
        let width = dx;
        let height = dy;
        let x = Board.startPoint.x;
        let y = Board.startPoint.y;

        if(width < 0){
            x += dx;
        }
        if(height < 0){
            y += dy;
        }

        this.border.x = x;
        this.border.y = y;
        this.border.width = Math.abs(width);
        this.border.height = Math.abs(height);
    }

    public destroyBorder(e?: MouseEvent, styleMenubar = <StyleMenubar>ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID)) {
        const placeholder = this.shapeGroup.elem.querySelector(`#${PLACE_HOLDER_ID}`);
        if(placeholder){
            ComponentRepository.removeComponentById(placeholder.id);
        }
        (<HTMLElement>this.tempGroup.elem).childNodes.forEach(childNode => ComponentRepository.removeComponentById((<HTMLElement>childNode).id));
        this.tempGroup.elem.innerHTML = '';

        this.border = null;
        styleMenubar.hide();
    }

    public destroySpecificBorder(borderIds: Array<string>){
        borderIds.forEach((borderId) => {
            ComponentRepository.removeComponentById(borderId);
        });
    }

    public changeCursor(type: string){
        this.elem.setAttribute('style',`width:100%;height:100%;cursor:${type};`);
    }
}