import { Board, Shape, Component } from '../../component';
import { BOARD_ID, PLACE_HOLDER_ID } from '../constant';

let Instance: ComponentRepository;

class ComponentRepository{

    constructor() { }

    public static getInstance(): ComponentRepository{
        if(!Instance) Instance = new ComponentRepository();
        return Instance;
    }

    public getComponentById(id: string): Component{
        return this[id];
    }

    public setComponentById(id: string, component: Component){
        this[id] = component;
    }

    public removeComponentById(id){
        document.getElementById(id)?.remove();
        document.getElementById(`${id}-innerText`)?.remove();
        delete this[id];
        delete this[`${id}-innerText`];
        delete this[`${id}-foreignobj`];
        delete this[`${id}-textbox`]
    }

    public getSvgElements(): Array<string>{
        const elements = [];
        for(const key in this) {
            const component = <Shape>this.getComponentById(key);
            if(component?.serialize && component.id !== PLACE_HOLDER_ID) {
                elements.push(component.serialize());
            }
        }

        return elements;
    }

    public removeSvgElements(): void{
        for(const key in this) {
            const component = <Shape>this.getComponentById(key);
            if(component?.serialize && component.id !== PLACE_HOLDER_ID) {
                this.removeComponentById(component.id);
            }
        }
        (<Board>this.getComponentById(BOARD_ID)).destroyBorder();
    }
}

export default ComponentRepository.getInstance();