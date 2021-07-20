import '../css/index.css';

//화면 사이즈 구하기
const screenWidth = screen.width;
const screenHeight = screen.height;

const main = document.getElementById('main');
main.style = `width:${screenWidth}px;height:${screenHeight}px;`;

main.innerText = 'syncdraw';