import { add, debounce } from './index';

jest.useFakeTimers();

describe('util 함수 테스트', () => {
    const mockFn = jest.fn();
    const ms = 100;

    beforeEach(() => {
        mockFn.mockClear();
    });

    describe('# add 함수', () => {
        it('3,5를 매개변수로 전달하면 8을 리턴한다.',() => {
           expect(add(3,5)).toBe(8);
        });
    });

    describe('# debounce 함수', () => {
        it(`리턴된 함수가 지정된 시간간격(${ms}ms)안에 다시 호출될 경우 매개변수로 전달된 함수 호출이 지연된다.`, () => {
            const func = debounce(mockFn, ms);
            func();
            jest.advanceTimersByTime(ms - 50);
            func();
            jest.advanceTimersByTime(ms + 50);
            expect(mockFn).toBeCalledTimes(1);
        });
    });
});