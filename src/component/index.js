import Board from './Board';
import Border from './Border';
import CreateBorder from './Border/CreateBorder';
import DragBorder from './Border/DragBorder';
import GroupBorder from './Border/GroupBorder';
import LineBorder from './Border/LineBorder';
import SizeBorder from './Border/SizeBorder';
import CustomButton from './CommonElement/CustomButton';
import CustomElement from './CommonElement/CustomElement';
import CustomInput from './CommonElement/CustomInput';
import CustomModal from './CommonElement/CustomModal';
import CustomSelect from './CommonElement/CustomSelect';
import GraphicElement from './CommonElement/GraphicElement';
import Toast from './CommonElement/Toast';
import Shape from './Shape';
import GText from './Shape/GText';
import Group from './Shape/Group';
import InnerText from './Shape/InnerText';
import Line from './Shape/Line';
import GLine from './Shape/Line/GLine';
import GPolyline from './Shape/Line/GPolyline';
import Path from './Shape/Path';
import GDisk from './Shape/Path/GDisk';
import GDocument from './Shape/Path/GDocument';
import Polygon from './Shape/Polygon';
import GInputoutput from './Shape/Polygon/GInputoutput';
import GJudgment from './Shape/Polygon/GJudgment';
import GPageconn from './Shape/Polygon/GPageconn';
import GPinput from './Shape/Polygon/GPinput';
import GReady from './Shape/Polygon/GReady';
import Rect from './Shape/Rect';
import GProcess from './Shape/Rect/GProcess';
import GTerminal from './Shape/Rect/GTerminal';
import HistoryMenubar from './Toolbar/HistoryMenubar';
import HistoryView from './Toolbar/HistoryView';
import ItemMenubar from './Toolbar/ItemMenubar';
import PageMenubar from './Toolbar/PageMenubar';
import StyleMenubar from './Toolbar/StyleMenubar';
import ZoomMenubar from './Toolbar/ZoomMenubar';

export const CommonElements = {
    CustomButton, CustomElement, CustomInput, CustomModal, CustomSelect,
    GraphicElement, Toast
}

export { Board }

export const Borders = {
    Border, CreateBorder, DragBorder, GroupBorder, LineBorder, SizeBorder
}

export const Shapes = {
    Shape, GText, Group, InnerText, Line, GLine, GPolyline, Path, GDisk, GDocument, Polygon, GInputoutput,
    GJudgment, GPageconn, GPinput, GReady, Rect, GProcess, GTerminal
}

export const Toolbars = {
    HistoryMenubar, HistoryView, ItemMenubar, PageMenubar, StyleMenubar, ZoomMenubar
}