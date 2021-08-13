import Border from '../index';
import {BOARD_ID, BORDER, COLOR, MENU_BAR} from '../../../service/constant';
import Shape from '../../Shape';
import ComponentRepository from '../../../service/ComponentRepository';
import TransformManager from '../../../service/TransformManager';
import GText from '../../GText';

export default class DragBorder extends Border{
    constructor({ parentId }) {
        super({
            parentId,
            id: BORDER.DRAG_BORDER_ID
        });
        this.elem.setAttribute('stroke-dasharray','5');
        this.elem.setAttribute('fill',COLOR.GRAY);
        this.elem.setAttribute('fill-opacity','0.2');
    }

    groupingShape(){
        const grouping = [];
        //테두리 내 모든 도형을 수집한다.
        const lineStartX = TransformManager.changeDocXToSvgX(this.x);
        const lineStartY = TransformManager.changeDocYToSvgY(this.y);
        const lineEndX = lineStartX + TransformManager.changeDocWidthToSvgWidth(this.width);
        const lineEndY = lineStartY + TransformManager.changeDocHeightToSvgHeight(this.height);
        let borderStartX = Infinity;
        let borderStartY = Infinity;
        let borderEndX = -Infinity;
        let borderEndY = -Infinity;
        for(const key in ComponentRepository) {
            const shape = ComponentRepository.getComponentById(key);
            if (!(shape instanceof Shape) && !(shape instanceof GText)) continue;

            const startX = shape.x;
            const startY = shape.y;
            const endX = shape.x + shape.width;
            const endY = shape.y + shape.height;

            if(lineStartX <= startX && lineStartY <= startY && lineEndX >= endX && lineEndY >= endY) {
                grouping.push(shape);
                if(startX < borderStartX) borderStartX = startX;
                if(startY < borderStartY) borderStartY = startY;
                if(endX > borderEndX) borderEndX = endX;
                if(endY > borderEndY) borderEndY = endY;
            }
        }

        if(grouping.length === 1){
            grouping[0].clickHandler();
            return true;
        }else if(grouping.length > 1){
            const board = ComponentRepository.getComponentById(BOARD_ID);
            const styleMenubar = ComponentRepository.getComponentById(MENU_BAR.STYLE_MENU_BAR_ID);
            board.destroyBorder();
            board.createGroupBorder({
                x: borderStartX,
                y: borderStartY,
                width: borderEndX - borderStartX,
                height: borderEndY - borderStartY,
                shapes: grouping
            });
            styleMenubar.show();
            return true;
        }

        return false;
    }
}