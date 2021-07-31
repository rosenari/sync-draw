import GraphicElement from '../../GraphicElement';
import ComponentRepository from '../../../service/ComponentRepository';
import { tinyGUID } from '../../../service/util';
import EventController from '../../../service/EventController';
import TransformManager from '../../../service/TransformManager';
import { COLOR, GROUP } from '../../../service/constant';
import SizeBorder from '../SizeBorder';

export default class LineBorder extends SizeBorder {
    static startPoint = {};

    constructor({ parentId, target }) {
        super({
            parentId,
            target
        });
    }

    render() {
        const pointsStr = [...this.points].map(point => `${point.getAttribute('cx')} ${point.getAttribute('cy')}`).join(', ');
        this.elem.setAttribute('points',pointsStr);
    }

    createEdge(){
        const tempGroup = ComponentRepository.getComponentById(GROUP.TEMP_GROUP_ID);
        const points = this.target.points;
        for(const i in points){
            const point = new GraphicElement({
                parentId: tempGroup.id,
                id: tinyGUID(),
                tagName: 'circle',
                handlers: {
                    mouseDownHandler: (e) => {
                        e.stopPropagation();
                        LineBorder.startPoint.x = TransformManager.changeDocXToSvgX(+e.target.getAttribute('cx'));
                        LineBorder.startPoint.y = TransformManager.changeDocYToSvgY(+e.target.getAttribute('cy'));
                        LineBorder.startPoint.target = {
                            points: [...this.target.points].map(point => {
                                return {
                                    ...point
                                }
                            }),
                            index: e.target.dataset.index
                        }

                        EventController.mouseMoveHandler = (e) => {
                            const dx = TransformManager.changeDocXToSvgX(e.pageX) - LineBorder.startPoint.x;
                            const dy = TransformManager.changeDocYToSvgY(e.pageY) - LineBorder.startPoint.y;
                            const x = LineBorder.startPoint.x + dx;
                            const y = LineBorder.startPoint.y + dy;
                            const index = LineBorder.startPoint.target.index;

                            this.renderEdge({ x, y, index });
                            this.renderTarget();
                            this.render();
                        }

                        EventController.mouseUpHandler = () => {
                            this.renderTarget();
                            SizeBorder.startPoint = {};
                            EventController.mouseMoveHandler = null;
                            EventController.mouseUpHandler = null;
                        }
                    }
                }
            });

            point.elem.setAttribute('r','5');
            point.elem.setAttribute('cx', points[+i].x);
            point.elem.setAttribute('cy', points[+i].y);
            point.elem.setAttribute('fill',COLOR.ORANGE);
            point.elem.setAttribute('cursor','grab');
            point.elem.setAttribute('data-index',this.points.length);
            this.points.push(point.elem);
        }
        this.render();
    }

    renderEdge({ x, y, index}) {
        this.points[index].setAttribute('cx', x);
        this.points[index].setAttribute('cy', y);
    }

    mouseDownHandler(e) {
        e.stopPropagation();
        LineBorder.startPoint.x = TransformManager.changeDocXToSvgX(e.pageX);
        LineBorder.startPoint.y = TransformManager.changeDocYToSvgY(e.pageY);
        LineBorder.startPoint.points = [...this.points].map(point => {
            return {
                x: point.getAttribute('cx'),
                y: point.getAttribute('cy')
            }
        });

        EventController.mouseMoveHandler = (e) => {
            e.stopPropagation();
            const dx = TransformManager.changeDocXToSvgX(e.pageX) - LineBorder.startPoint.x;
            const dy = TransformManager.changeDocYToSvgY(e.pageY) - LineBorder.startPoint.y;

            LineBorder.startPoint.points.forEach((point, index) => {
                this.renderEdge({ x:+point.x + dx, y:+point.y + dy, index: index });
            });
            this.renderTarget();
            this.render();
        }

        EventController.mouseUpHandler = (e) => {
            e.stopPropagation();
            this.renderTarget();
            SizeBorder.startPoint = {};
            EventController.mouseMoveHandler = null;
            EventController.mouseUpHandler = null;
        }
    }

    renderTarget(){
        this.target.points = [...this.points].map(point => {
            return {
                x: point.getAttribute('cx'),
                y: point.getAttribute('cy')
            }
        });
    }
}