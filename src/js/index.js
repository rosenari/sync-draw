import '../css/index.css';
import App from './app';

const main = document.getElementById('main');
main.setAttribute('style', 'width:100%;height:100%;')

const app = new App({ elem: main });