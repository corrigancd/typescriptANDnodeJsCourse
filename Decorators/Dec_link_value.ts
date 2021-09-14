const someObject = {
  someProperty: "initial",
};

class ManagerLinkValue {
  @linkValue(someObject)
  someProperty: string | undefined;
}

const manager = new ManagerLinkValue();

manager.someProperty = "123";
console.log('someObject.someProperty', someObject.someProperty)
manager.someProperty = "456";
console.log('someObject.someProperty', someObject.someProperty)

function linkValue(otherObject: any) {
  return function (target: any, key: string) {
    let property = target[key];

    const getter = () => {
      return property;
    };

    const setter = (newVal: any) => {
      otherObject[key] = newVal;
      property = newVal;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      configurable: true,
      enumerable: true,
    });
  };
}
