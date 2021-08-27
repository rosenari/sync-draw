import Border from '../index';
import { Shape, Board } from '../../index';
import { ComponentRepository, TransformManager } from '../../../service';
import {BOARD_ID, BORDER, COLOR, RATIO} from '../../../service/constant';

export default class DragBorder extends Border{
    public board: Board;

    constructor({ parentId, board = <Board>ComponentRepository.getComponentById(BOARD_ID) }: {
        parentId: string;
        board?: Board;
    }) {
        super({
            parentId,
            id: BORDER.DRAG_BORDER_ID
        });
        this.board = board;
        this.elem.setAttribute('stroke-dasharray','5');
        this.elem.setAttribute('fill',COLOR.GRAY);
        this.elem.setAttribute('fill-opacity', RATIO.PERCENT_20.toString());
    }

    public groupingShape(){
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
            const component = ComponentRepository.getComponentById(key);
            if (!(component instanceof Shape)) continue;
            const shape = <Shape>component;

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