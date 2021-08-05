import Border from '../index';
import './index.css';
import { BORDER } from '../../../service/constant';

export default class CreateBorder extends Border {
    constructor({ parentId, shape }) {
        super({
            parentId,
            id: BORDER.CREATE_BORDER_ID,
            shape
        });
        this.elem.setAttribute('class','create-border');
        this.elem.setAttribute('stroke-dasharray', '6');
    }
}