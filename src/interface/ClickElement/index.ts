import { Component } from '../../component';

export default interface ClickElement {
    clickHandler: (e?: Event, component?: Component) => void;
}