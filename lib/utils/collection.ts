class Collection<T, V> extends Map {
  constructor(...values: V[]) {
    super();
    values.forEach((element: any) => {
      this.set(element.id, element);
    });
  }

  array() {
    return [...this.values()];
  }

  clone() {
    return new Collection(...this.values());
  }

  concat(...collections: Collection<T, V>[]) {
    let temp = this.clone();
    collections.forEach((collection: Collection<T, V>) => {
      collection.forEach((v: V, k: T) => temp.set(k, v));
    });
    return temp;
  }

  difference(other: Collection<T, V>) {
    let diff = new Collection();

    this.forEach((v: V, k: T) => {
      if (!other.has(k)) diff.set(k, v);
    });
    other.forEach((v: V, k: T) => {
      if (!this.has(k)) diff.set(k, v);
    });

    return diff;
  }

  each(fn: (v: V, k?: T) => void, thisArg?: any) {
    this.forEach(fn, thisArg);
    return this;
  }

  equals(other: Collection<T, V>) {
    let temp = this.array().filter((g) =>
      other.has(this.findKey((v: V) => v === g))
    );
    if (temp.length === this.size) return true;
    else return false;
  }

  every(fn: (v: V) => boolean, thisArg?: any) {
    return this.array().every(fn, thisArg);
  }

  filter(fn: (v: V) => boolean, thisArg?: any) {
    return new Collection(this.array().filter(fn, thisArg));
  }

  find(fn: (v: V) => boolean, thisArg?: any) {
    let filtered = this.array().filter(fn, thisArg);
    if (filtered.length > 0) return filtered[0];
    else return null;
  }

  findKey(fn: (v: V) => boolean, thisArg?: any) {
    let result = this.find(fn, thisArg);
    for (const key of this.keys()) {
      if (this.get(key) === result) return key;
    }
    return null;
  }

  intersect(other: Collection<T, V>) {
    let temp = new Collection();
    this.array()
      .filter((v: V) => other.has(this.findKey((x: V) => x === v)))
      .map((v: V) =>
        temp.set(
          this.findKey((x: V) => x === v),
          v
        )
      );
    return temp;
  }

  keyArray() {
    return [...this.keys()];
  }

  map(fn: (v: V) => any, thisArg?: any) {
    return this.array().map(fn, thisArg);
  }

  mapValues(fn: (v: V) => any, thisArg?: any) {
    return new Collection(this.array().map(fn, thisArg));
  }

  reduce(fn: (acc: any, cur: V) => any, initial?: any) {
    this.array().reduce(fn, initial);
  }

  some(fn: (v: V) => boolean, thisArg?: any) {
    for (const value of this.values()) if (fn(value)) return true;
    return false;
  }
}

export default Collection;
