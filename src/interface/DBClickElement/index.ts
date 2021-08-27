import {Component} from '../../component';

export default interface DBClickElement {
    dbClickHandler: (e?: Event, component?: Component) => void;
}