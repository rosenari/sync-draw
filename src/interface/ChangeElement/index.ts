import { Component } from '../../component';

export default interface ChangeElement {
    changeHandler: (e?: Event, component?: Component) => void;
}