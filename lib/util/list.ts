export default class List<T, V> extends Map {
    constructor(...values: V[]) {
        super();
        for (let v of values) {
            let value = v as any;
            if ("id" in value) this.set(value.id, value);
        }
    }

    array() { return [...this.values()]; }
    clone() { return new List(...this.values()); }
    concat(...lists: List<T, V>[]) {
        let temp = this.clone();
        for (let list of lists) { list.forEach((v: V, t: T) => temp.set(t, v)); }
        return temp;
    }

    equals(other: List<T, V>) {
        let temp = this.array().filter((g) => other.has(this.findKey((v: V) => v === g)));
        if (temp.length === this.size) return true;
        else return false;
    }

    every(fn: (v: V) => boolean, thisArg?: any) {
        return this.array().every(fn, thisArg);
    }

    filter(fn: (v: V) => boolean, thisArg?: any) {
        return new List(this.array().filter(fn, thisArg));
    }

    find(fn: (v: V) => boolean, thisArg?: any) {
        let filtered = this.array().filter(fn, thisArg);
        if (filtered.length > 0) return filtered[0];
        else return null;
    }

    findKey(fn: (v: V) => boolean, thisArg?: any) {
        let result = this.find(fn, thisArg);
        for (const key of this.keys()) { if (this.get(key) === result) return key; }
        return null;
    }

    keyArray() { return [...this.keys()]; }
    mapArray(fn: (v: V) => any, thisArg?: any) { return this.array().map(fn, thisArg); }
    mapList(fn: (v: V) => any, thisArg?: any) { return new List(this.array().map(fn, thisArg));}
    reduce(fn: (acc: any, cur: V) => any, initial?: any) { this.array().reduce(fn, initial); }
    some(fn: (v: V) => boolean) { for (const value of this.values()) if (fn(value)) return true; return false; }
}
