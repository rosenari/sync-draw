import { Component } from '../../component';

export default interface MouseMoveElement {
    mouseMoveHandler: (e?: Event, component?: Component) => void;
}