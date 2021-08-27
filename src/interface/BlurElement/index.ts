import { Component } from '../../component';

export default interface BlurElement {
    blurHandler: (e?: Event, component?: Component) => void;
}