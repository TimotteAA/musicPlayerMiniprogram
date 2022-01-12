export function throttle(fn, interval, cb) {
    let lastTime = 0;

    function _throttle(...args) {
        const nowTime = Date.now();
        const remainTime = interval - (nowTime - lastTime);

        if (remainTime <= 0) {
            const result = fn.call(this, ...args);
            return cb(result);
            lastTime = nowTime;  
        }
    } 
    return _throttle;
}