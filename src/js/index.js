import '../css/index.css';
import App from './app';

//화면 사이즈 구하기
const screenWidth = screen.width;
const screenHeight = screen.height;

const main = document.getElementById('main');
main.style = `position:relative;width:${screenWidth}px;height:${screenHeight}px;`;

const app = new App({elem: main, screenSize: {
    width: screenWidth,
    height: screenHeight
}});