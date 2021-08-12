export const XMLNS = 'http://www.w3.org/2000/svg';

export const APP_ID = 'app';

export const BOARD_ID = 'board';

export const PLACE_HOLDER_ID = 'placeholder';

export const HISTORY_VIEW_ID = 'history-view';

export const GROUP = {
    SHAPE_GROUP_ID  : 'shape-group',
    TEMP_GROUP_ID : 'temp-group'
}

export const MENU_BAR = {
    PAGE_MENU_BAR_ID : 'page-menu-bar',
    ITEM_MENU_BAR_ID : 'item-menu-bar',
    STYLE_MENU_BAR_ID : 'style-menu-bar',
    HISTORY_MENU_BAR_ID : 'history-menu-bar',
    ZOOM_MENU_BAR_ID : 'zoom-menu-bar'
}

export const BORDER = {
    BORDER_ID : 'border',
    CREATE_BORDER_ID : 'create-border',
    SIZE_BORDER_ID : 'size-border',
    DRAG_BORDER_ID : 'drag-border',
    GROUP_BORDER_ID : 'group-border'
}

export const STYLE_ELEM = {
    FONT_SIZE_TEXT_ID : 'style-font-size-text',
    FONT_SIZE_SELECT_ID : 'style-font-size-select',
    FONT_COLOR_TEXT_ID : 'style-font-color-text',
    FONT_COLOR_TEXT_INPUT : 'style-font-color-input',
    FILL_TEXT_ID : 'style-fill-text',
    FILL_INPUT_ID : 'style-fill-input',
    STROKE_TEXT_ID : 'style-stroke-text',
    STROKE_INPUT_ID : 'style-stroke-input'
}

export const FONT = {
    SIZE_1 : '8px',
    SIZE_2 : '10px',
    SIZE_3 : '12px',
    SIZE_4 : '14px',
    SIZE_5 : '16px',
    SIZE_6 : '18px'
}

export const RATIO_TEXT_ID = 'ratio-text';

export const BUTTON = {
    PAGE_NEW_BTN_ID : 'page-new-btn',
    PAGE_SAVE_BTN_ID : 'page-save-btn',
    PAGE_LOAD_BTN_ID : 'page-load-btn',
    HISTORY_UNDO_BTN_ID : 'history-undo-btn',
    HISTORY_REDO_BTN_ID : 'history-redo-btn',
    ZOOM_IN_BTN_ID : 'zoom-in-btn',
    ZOOM_OUT_BTN_ID : 'zoom-out-btn'
}

export const RANDOM_MAX = 0x10000000;

export const COLOR = {
    ORANGE : '#FFA500',
    KAKAO : '#FEE500',
    BLACK : '#555555',
    GRAY : '#808080',
    WHITE : '#FFFFFF'
}

export const RATIO = {
    PERCENT_10: 0.1,
    PERCENT_15: 0.15,
    PERCENT_20: 0.2,
    PERCENT_25: 0.25,
    PERCENT_30: 0.3,
    PERCENT_35: 0.35,
    PERCENT_40: 0.4,
    PERCENT_45: 0.45,
    PERCENT_50: 0.5,
    PERCENT_55: 0.55,
    PERCENT_60: 0.6,
    PERCENT_65: 0.65,
    PERCENT_70: 0.7,
    PERCENT_75: 0.75,
    PERCENT_80: 0.8,
    PERCENT_85: 0.85,
    PERCENT_90: 0.9,
    PERCENT_95: 0.95,
}

export const COMPONENT_TYPE = {
    GText : 'GText',
    InnerText : 'InnerText',
    GLine : 'GLine',
    GPolyline : 'GPolyline',
    GDisk : 'GDisk',
    GDocument: 'GDocument',
    GInputoutput : 'GInputoutput',
    GJudgment : 'GJudgment',
    GPageconn : 'GPageconn',
    GPinput : 'GPinput',
    GReady : 'GReady',
    GProcess : 'GProcess',
    GTerminal : 'GTerminal'
}

export const CURSOR_TYPE = {
    MOUSE : 'mouse',
    GRAB : 'grab',
    CROSSHAIR : 'crosshair',
    SRESIZE : 's-resize'
}

export const PHRASES = {
    INIT : '정말 초기화 하시겠습니까 ?',
    STORE_NAME_INPUT : '저장할 이름을 입력해주세요.',
    ALREADY_NAME : '이미 존재하는 이름입니다. 덮어쓰시겠습니까 ?',
    NAME_SELECT : '이름을 선택해주세요.',
    TEXT_INPUT_OVER : '텍스트 입력은 50자 이상을 초과할 수 없습니다.',
    NOT_EXIST_PREV_TASK : '이전 작업이 없습니다.',
    NOT_EXIST_NEXT_TASK : '다음 작업이 없습니다.',
    NOT_EXIST_STORE : '저장내역이 존재하지 않습니다.',
    NOT_EXIST_NAME_STORE : '해당이름의 저장내역이 존재하지 않습니다.',
    AUTO_RESTORE : '자동저장내역을 복구 하시겠습니까 ?'
}

export const BEHAVIOR = {
    INIT: '초기화',
    CREATE : '생성',
    MODIFY : '수정',
    MOVE : '이동',
    DELETE : '삭제'
}

export const KEYEVENT = {
    deleteKey : 'Delete',
    LEFT : 'ArrowLeft',
    UP : 'ArrowUp',
    RIGHT : 'ArrowRight',
    DOWN : 'ArrowDown',
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