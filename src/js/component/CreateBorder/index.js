import Border from '../Border';

export default class CreateBorder extends Border {
    constructor({ parentId, shape }) {
        super({
            parentId,
            id:'create-border',
            shape
        });
        this.elem.setAttribute('stroke-dasharray', '6');
    }
}