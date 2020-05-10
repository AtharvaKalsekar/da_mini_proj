import { Injectable } from '@angular/core';

function _window() : any {
   return window;
}

@Injectable()
export class WinRef {
    get nativeWindow() : any {
        return _window();
    }
}
