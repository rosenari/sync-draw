import { Component } from '../../component';

export default interface InputElement {
    inputHandler: (e?: Event, component?: Component) => void;
}