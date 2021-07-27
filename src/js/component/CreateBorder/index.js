import Border from '../Border';

export default class CreateBorder extends Border {
    constructor({ parentId }) {
        super({
            parentId,
            id:'create-border'
        });
        this.elem.setAttribute('stroke-dasharray', '6');
    }
}