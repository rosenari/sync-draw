import {Component} from '../../component';

export default interface KeyUpElement {
    keyUpHandler: (e?: Event, component?: Component) => void;
}