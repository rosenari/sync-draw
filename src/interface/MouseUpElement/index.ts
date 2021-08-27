import { Component } from '../../component';

export default interface MouseUpElement {
    mouseUpHandler: (e?: Event, component?: Component) => void;
}