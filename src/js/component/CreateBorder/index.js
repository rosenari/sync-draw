import Border from '../Border';
import './index.css';
import { CREATE_BORDER_ID } from '../../service/constant';

export default class CreateBorder extends Border {
    constructor({ parentId, shape }) {
        super({
            parentId,
            id: CREATE_BORDER_ID,
            shape
        });
        this.elem.setAttribute('class','create-border');
        this.elem.setAttribute('stroke-dasharray', '6');
    }
}