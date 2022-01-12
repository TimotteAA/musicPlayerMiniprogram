export function debounce(fn, delay, cb) {
    let timer = null;
    
    // console.log(fn)
    function _debounce(...args) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(async () => {
            let result = await fn.call(this, ...args);
            if (cb && result) {
                result = Promise.resolve(result);

                return cb(result);
            }
        }, delay);
    }

    return _debounce
}