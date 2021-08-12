import CustomElement from './CustomElement';
import GraphicElement from './GraphicElement';
import GText from './GText';
import Group from './Group';
import Shape from './Shape';
import InnerText from './Shape/InnerText';
import Line from './Shape/Line';
import GLine from './Shape/Line/GLine';
import GPolyline from './Shape/Line/GPolyline';
import GDisk from './Shape/Path/GDisk';
import GDocument from './Shape/Path/GDocument';
import GInputoutput from './Shape/Polygon/GInputoutput';
import GJudgment from './Shape/Polygon/GJudgment';
import GPageconn from './Shape/Polygon/GPageconn';
import GPinput from './Shape/Polygon/GPinput';
import GReady from './Shape/Polygon/GReady';
import GProcess from './Shape/Rect/GProcess';
import GTerminal from './Shape/Rect/GTerminal';

export {
    CustomElement, GraphicElement, GText, Group, Shape, InnerText, Line, GLine, GPolyline, GDisk, GDocument, GInputoutput,
    GJudgment, GPageconn, GPinput, GReady, GProcess, GTerminal
};

export const Components = {
    CustomElement, GraphicElement, GText, Group, Shape, InnerText, Line, GLine, GPolyline, GDisk, GDocument, GInputoutput,
    GJudgment, GPageconn, GPinput, GReady, GProcess, GTerminal
}

export const ComponentKor = {
    All : '페이지',
    CustomElement : '커스텀 엘리먼트',
    GraphicElement : '그래픽 엘리먼트',
    GText: '텍스트',
    Group: '그룹',
    Shape: '모양',
    InnerText: '내부텍스트',
    Line: '선',
    GLine: '흐름선',
    GPolyline: '직선',
    GDisk: '디스크',
    GDocument: '서류',
    GInputoutput: '입출력',
    GJudgment: '판단',
    GPageconn: '페이지연결',
    GPinput: '수동입력',
    GReady: '준비',
    GProcess: '처리',
    GTerminal: '단말'
}