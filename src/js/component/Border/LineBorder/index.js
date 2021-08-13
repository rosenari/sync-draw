import GraphicElement from '../../GraphicElement';
import ComponentRepository from '../../../service/ComponentRepository';
import HistoryManager from '../../../service/HistoryManager';
import { tinyGUID } from '../../../service/util';
import EventController from '../../../service/EventController';
import TransformManager from '../../../service/TransformManager';
import {BEHAVIOR, COLOR, GROUP} from '../../../service/constant';
import SizeBorder from '../SizeBorder';
import { Line, Shape } from '../../../component';
import './index.css';

export default class LineBorder extends SizeBorder {
    static startPoint = {};

    constructor({ parentId, target }) {
        super({
            parentId,
            target
        });
        this.elem.setAttribute('stroke-dasharray','0');
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
                        LineBorder.startPoint.collisionInfo = [];
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

                            this.detectCollisionShape({ x, y, index });
                            this.renderEdge({ x, y, index });
                            this.renderTarget();
                            this.render();
                        }

                        EventController.mouseUpHandler = () => {
                            this.adjustCollisionInfo();
                            this.renderTarget();
                            HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MODIFY, type:`${this.target.type}` });
                            SizeBorder.startPoint = {};
                            EventController.mouseMoveHandler = null;
                            EventController.mouseOverHandler = null;
                            EventController.mouseUpHandler = null;
                        }
                    }
                }
            });

            point.elem.setAttribute('r','5');
            point.elem.setAttribute('cx', TransformManager.changeSvgXToDocX(points[+i].x));
            point.elem.setAttribute('cy', TransformManager.changeSvgYToDocY(points[+i].y));
            point.elem.setAttribute('fill',COLOR.ORANGE);
            point.elem.setAttribute('cursor','grab');
            point.elem.setAttribute('data-index',this.points.length);
            this.points.push(point.elem);
        }
        this.render();
    }

    renderEdge({ x, y, index}) {
        this.points[index].setAttribute('cx', TransformManager.changeSvgXToDocX(x));
        this.points[index].setAttribute('cy', TransformManager.changeSvgYToDocY(y));
    }

    mouseDownHandler(e) {
        e.stopPropagation();
        LineBorder.startPoint.x = TransformManager.changeDocXToSvgX(e.pageX);
        LineBorder.startPoint.y = TransformManager.changeDocYToSvgY(e.pageY);
        LineBorder.startPoint.points = [...this.points].map(point => {
            return {
                x: TransformManager.changeDocXToSvgX(point.getAttribute('cx')),
                y: TransformManager.changeDocYToSvgY(point.getAttribute('cy'))
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
            HistoryManager.updateHistoryToLatest({ behavior: BEHAVIOR.MOVE, type:`${this.target.type}` });
            SizeBorder.startPoint = {};
            EventController.mouseMoveHandler = null;
            EventController.mouseUpHandler = null;
        }
    }

    renderTarget(){
        this.target.points = [...this.points].map(point => {
            return {
                x: TransformManager.changeDocXToSvgX(point.getAttribute('cx')),
                y: TransformManager.changeDocYToSvgY(point.getAttribute('cy'))
            }
        });
    }

    //모양과 충돌하는지 순회를 통해탐지, 탐지할 경우 충돌정보 갱신
    detectCollisionShape({ x, y, index}){
        if(!this.target.arrow) return;

        LineBorder.startPoint.collisionInfo = [];
        for(const key in ComponentRepository) {
            const shape = ComponentRepository.getComponentById(key);
            if (!(shape instanceof Shape)) continue;
            if (shape instanceof Line) continue;

            const padding = 30;
            const startX = shape.x;
            const startY = shape.y;
            const endX = shape.x + shape.width;
            const endY = shape.y + shape.height;

            const ratioX = ((x - startX) / shape.width).toFixed(2);
            const ratioY = ((y - startY) / shape.height).toFixed(2);

            let command = 'addLinkedLine';
            let pointInfo = {
                ratios: [ratioX, ratioY],
                index
            }

            if(startX - padding > x || endX + padding < x || startY - padding > y || endY + padding < y){
                command = 'removeLinkedLine';
                pointInfo = null;
                shape.elem.classList.remove('shape-collision');
            }else{
                shape.elem.classList.add('shape-collision');
            }

            LineBorder.startPoint.collisionInfo.push({
                command,
                shape,
                pointInfo
            });
        }
    }

    //모양요소 흐름선 정보 갱신
    adjustCollisionInfo(){
        const collisionInfos = LineBorder.startPoint.collisionInfo;
        const line = this.target;
        for(const info of collisionInfos){
            info.shape.elem.classList.remove('shape-collision');
            info.shape[info.command]({
                line,
                pointInfo: info.pointInfo
            });
        }
    }
}