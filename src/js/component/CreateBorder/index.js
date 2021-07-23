import Border from '../Border';
import './index.css';

export default class CreateBorder extends Border {
    constructor({ parentId, shape }) {
        super({
            parentId,
            id:'create-border',
            shape
        });
        this.elem.setAttribute('class','create-border');
        this.elem.setAttribute('stroke-dasharray', '6');
    }
}