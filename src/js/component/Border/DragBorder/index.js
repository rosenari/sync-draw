import Border from '../index';
import { Shapes } from '../../index';
import { Service } from '../../../service';
import {BOARD_ID, BORDER, COLOR, RATIO} from '../../../service/constant';

export default class DragBorder extends Border{
    board = null;

    constructor({ parentId, board = Service.ComponentRepository.getComponentById(BOARD_ID) }) {
        super({
            parentId,
            id: BORDER.DRAG_BORDER_ID
        });
        this.board = board;
        this.elem.setAttribute('stroke-dasharray','5');
        this.elem.setAttribute('fill',COLOR.GRAY);
        this.elem.setAttribute('fill-opacity', RATIO.PERCENT_20);
    }

    groupingShape(){
        const grouping = [];
        //테두리 내 모든 도형을 수집한다.
        const lineStartX = Service.TransformManager.changeDocXToSvgX(this.x);
        const lineStartY = Service.TransformManager.changeDocYToSvgY(this.y);
        const lineEndX = lineStartX + Service.TransformManager.changeDocWidthToSvgWidth(this.width);
        const lineEndY = lineStartY + Service.TransformManager.changeDocHeightToSvgHeight(this.height);
        let borderStartX = Infinity;
        let borderStartY = Infinity;
        let borderEndX = -Infinity;
        let borderEndY = -Infinity;
        for(const key in Service.ComponentRepository) {
            const shape = Service.ComponentRepository.getComponentById(key);
            if (!(shape instanceof Shapes.Shape) && !(shape instanceof Shapes.GText)) continue;

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
            this.board.destroyBorder();
            this.board.createGroupBorder({
                x: borderStartX,
                y: borderStartY,
                width: borderEndX - borderStartX,
                height: borderEndY - borderStartY,
                shapes: grouping
            });
            return true;
        }

        return false;
    }
}