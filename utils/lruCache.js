export class LRUCache {
    constructor(capacity) {
        this.cache = new Set();
        this.capacity = capacity;
    }

    setItem(key) {
        this.cache.add(key);
        if (this.cache.size > this.capacity) {
            const first = this.cache[Symbol.iterator]().next().value;
            console.log(first);
            this.cache.delete(first);
        }
    }

    getItems() {
        return Array.from(this.cache.values());
    }
}