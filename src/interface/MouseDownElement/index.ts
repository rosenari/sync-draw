import {Component} from '../../component';

export default interface MouseDownElement {
    mouseDownHandler: (e?: Event, component?: Component) => void;
}