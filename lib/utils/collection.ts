/**
 * A generic collection class that extends map and has featuers from arrays as well.
 */
class Collection<T, V> extends Map {
  /**
   * Creates a new collection.
   * @param values The values to be added to the collection.
   */
  constructor(...values: V[]) {
    super();
    values.forEach((element: any) => {
      this.set(element.id, element);
    });
  }

  /**
   * Returns an array of the values stored in the collection.
   */
  array() {
    return [...this.values()];
  }

  /**
   * Returns a new independent collection from the values of current collection.
   */
  clone() {
    return new Collection(...this.values());
  }

  /**
   * Combines the collections together and returns the new collection.
   * @param collections The collections to concatenate.
   */
  concat(...collections: Collection<T, V>[]) {
    let temp = this.clone();
    collections.forEach((collection: Collection<T, V>) => {
      collection.forEach((v: V, k: T) => temp.set(k, v));
    });
    return temp;
  }

  /**
   * Returns a new collection that contains the items that are in only one of the two collections.
   * @param other The other collection to compare with.
   */
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

  /**
   * Runs a given function for each value inside the collection.
   * 
   * @param fn The function to be run for each of the values.
   * @param thisArg The value for "this" inside the function.
   */
  each(fn: (v: V, k?: T) => void, thisArg?: any) {
    this.forEach(fn, thisArg);
    return this;
  }

  /**
   * Checks whether the two collections are equal or not.
   * 
   * @param other The other collection to compare with.
   */
  equals(other: Collection<T, V>) {
    let temp = this.array().filter((g) =>
      other.has(this.findKey((v: V) => v === g))
    );
    if (temp.length === this.size) return true;
    else return false;
  }

  /**
   * Checks if each of the value satisfies a specific condition.
   * 
   * @param fn The function that checks for the satisfaction of the condition (must return a boolean).
   * @param thisArg The value for "this" to be passed into the function.
   */
  every(fn: (v: V) => boolean, thisArg?: any) {
    return this.array().every(fn, thisArg);
  }

  /**
   * Returns a new collection that satisfies a specific condition.
   * @param fn The filter function that checks for the satisfaction of the condition.
   * @param thisArg The value for "this" to be passed into the function.
   */
  filter(fn: (v: V) => boolean, thisArg?: any) {
    return new Collection(this.array().filter(fn, thisArg));
  }

  /**
   * Returns the value that satisfies a given condition.
   * 
   * @param fn The function that checks for the satisfaction of the condition.
   * @param thisArg The value for "this" to be passed into the function.
   */
  find(fn: (v: V) => boolean, thisArg?: any) {
    let filtered = this.array().filter(fn, thisArg);
    if (filtered.length > 0) return filtered[0];
    else return null;
  }

  /**
   * Finds the key for the value that satisfies a given condition.
   * 
   * @param fn The function to find the object whose key is to be found.
   * @param thisArg The value for "this" to be passed into the function.
   */
  findKey(fn: (v: V) => boolean, thisArg?: any) {
    let result = this.find(fn, thisArg);
    for (const key of this.keys()) {
      if (this.get(key) === result) return key;
    }
    return null;
  }

  /**
   * Returns a new collection containing only the items shard between the two collections.
   * 
   * @param other The other collection to intersect with.
   */
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

  /**
   * Returns an array of keys of the collection.
   */
  keyArray() {
    return [...this.keys()];
  }

  /**
   * Maps the collection to specific values and returns the array of calculated values.
   * 
   * @param fn The mapping function.
   * @param thisArg The value for "this" to be passed into the function.
   */
  map(fn: (v: V) => any, thisArg?: any) {
    return this.array().map(fn, thisArg);
  }

  /**
   * Same as map except returns a collection instead of an array.
   * 
   * @param fn The mapping function.
   * @param thisArg The value for "this" to be passed into the function.
   */
  mapValues(fn: (v: V) => any, thisArg?: any) {
    return new Collection(this.array().map(fn, thisArg));
  }

  /**
   * Reduces the collection into a single value.
   * 
   * @param fn The reducing function
   * @param initial The initial value.
   */
  reduce(fn: (acc: any, cur: V) => any, initial?: any) {
    this.array().reduce(fn, initial);
  }

  /**
   * Checks whether any of the values satisfy a condition.
   * 
   * @param fn The function to check for the satisfaction of the condition.
   * @param thisArg The value for "this" to be passed into the function.
   */
  some(fn: (v: V) => boolean, thisArg?: any) {
    for (const value of this.values()) if (fn(value)) return true;
    return false;
  }
}

export default Collection;
