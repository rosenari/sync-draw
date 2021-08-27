import Border from '../index';
import { Shape } from '../../../component';
import { BORDER } from '../../../service/constant';
import './index.css';

export default class CreateBorder extends Border {
    constructor({ parentId, shape }: {
        parentId: string,
        shape: Shape
    }) {
        super({
            parentId,
            id: BORDER.CREATE_BORDER_ID,
            shape
        });
        this.elem.setAttribute('class','create-border');
        this.elem.setAttribute('stroke-dasharray', '6');
    }
}