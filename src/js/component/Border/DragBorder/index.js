import Border from '../index';
import {BOARD_ID, BORDER} from '../../../service/constant';
import Shape from '../../Shape';
import Line from '../../Shape/Line';
import ComponentRepository from '../../../service/ComponentRepository';
import GText from '../../GText';

export default class DragBorder extends Border{
    constructor({ parentId }) {
        super({
            parentId,
            id: BORDER.DRAG_BORDER_ID
        });
    }

    groupingShape(){
        const grouping = [];
        //테두리 내 모든 도형을 수집한다.
        const lineStartX = this.x;
        const lineStartY = this.y;
        const lineEndX = this.x + this.width;
        const lineEndY = this.y + this.height;
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
            board.createGroupBorder({
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