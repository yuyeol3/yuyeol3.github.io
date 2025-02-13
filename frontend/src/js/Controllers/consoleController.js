export default class ConsoleWrapper {
    constructor(console, enabled = true) {
        this.console = console;
        this.enabled = enabled;
    }

    // 로그 메시지 앞에 타임스탬프를 추가하는 예시
    _getTimestamp() {
        return new Date().toISOString();
    }

    log(...args) {
        if (this.enabled) {
            this.console.log(`[${this._getTimestamp()}]`, ...args);
        }
    }

    info(...args) {
        if (this.enabled) {
            this.console.info(`[${this._getTimestamp()}]`, ...args);
        }
    }

    warn(...args) {
        if (this.enabled) {
            this.console.warn(`[${this._getTimestamp()}]`, ...args);
        }
    }

    error(...args) {
        if (this.enabled) {
            this.console.error(`[${this._getTimestamp()}]`, ...args);
        }
    }

    debug(...args) {
        if (this.enabled) {
            this.console.debug(`[${this._getTimestamp()}]`, ...args);
        }
    }

    // 로그 활성화 여부를 동적으로 변경할 수 있습니다.
    setEnabled(flag) {
        this.enabled = flag;
    }
}

