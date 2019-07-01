import { Rectangle } from '../../src/JassOverrides/Rectangle';


_G.DisplayTimedTextToForce = function (toForce: force, duration: number, message: string): void {
    print(`[SendMessage]: ${message}`);
};
_G.sound = {
    filename: string,
};
_G.CreateSound = function (fileName: string,
                           looping: boolean,
                           is3D: boolean,
                           stopwhenoutofrange: boolean,
                           fadeInRate: number,
                           fadeOutRate: number,
                           eaxSetting: string): sound {
    // @ts-ignore
    return {filename: fileName};
};

_G.GetPlayableMapRect = function (): Rectangle {
    return new Rectangle([-2000, -2000, 2000, 2000]);
};


_G.SetUnitInvulnerable = function (whichUnit: unit, flag: boolean): void {
    return;
};
_G.PauseUnit = function (whichUnit: unit, flag: boolean): void {
    return;
};
_G.PauseUnitBJ = _G.PauseUnit;

_G.GetRectCenterX = function (whichRect: Rectangle): number {
    if (!whichRect) {
        return 0;
    }
    return whichRect.GetCenterX();
};
_G.GetRectCenterY = function (whichRect: Rectangle): number {
    if (!whichRect) {
        return 0;
    }
    return whichRect.GetCenterY();
};

_G.AddSpecialEffect = function (modelName: string, x: number, y: number): number {
    return 1;
};

_G.DestroyEffect = function (whichEffect: number): void {
    return;
};


// TODO: do timer in a good way
_G.CreateTimer = function (): number {
    return 1;
};

_G.TimerStart = function (timer: number): void {
    return;
};


_G.Filter = function (func: () => boolean): () => boolean {
    return () => func();
};

_G.DialogCreate = function (): number {
    return 1;
};

_G.CreateDestructable = function (objectid: number, x: number, y: number, face: number, scale: number, variation: number): number {
    return 1;
};