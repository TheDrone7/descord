export default class List<T, V> extends Map {
  constructor(...values: V[]) {
    super();
    for (const v of values) {
      const value = v as any;
      if ("id" in value) this.set(value.id, value);
    }
  }

  array(): V[] { return [...this.values()]; }
  clone(): List<T, V> { return new List(...this.values()); }
  concat(...lists: List<T, V>[]): List<T, V> {
    const temp = this.clone();
    for (const list of lists) { list.forEach((v: V, t: T) => temp.set(t, v)); }
    return temp;
  }

  equals(other: List<T, V>) {
    const temp = this.array().filter((g) => other.has(this.findKey((v: V) => v === g)));
    return temp.length === this.size;
  }

  every(fn: (v: V) => boolean, thisArg?: any) {
    return this.array().every(fn, thisArg);
  }

  filter(fn: (v: V) => boolean, thisArg?: any): List<T, V> {
    return new List(...this.array().filter(fn, thisArg));
  }

  find(fn: (v: V) => boolean, thisArg?: any): V|null {
    const filtered = this.array().filter(fn, thisArg);
    if (filtered.length > 0) return filtered[0];
    else return null;
  }

  findKey(fn: (v: V) => boolean, thisArg?: any): T|null {
    const result = this.find(fn, thisArg);
    for (const key of this.keys()) { if (this.get(key) === result) return key; }
    return null;
  }

  keyArray(): T[] { return [...this.keys()]; }
  map(fn: (v: V) => any, thisArg?: any): any[] { return this.array().map(fn, thisArg); }
  reduce(fn: (acc: any, cur: V) => any, initial?: any) { this.array().reduce(fn, initial); }
  some(fn: (v: V) => boolean) { for (const value of this.values()) if (fn(value)) return true; return false; }
}
