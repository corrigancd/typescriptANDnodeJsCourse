class ManagerWatchChange {
  @watchChange
  someProperty: string | undefined;
}

const managerWatchChange = new ManagerWatchChange();

managerWatchChange.someProperty = '123';
managerWatchChange.someProperty = '456';

function watchChange(target: any, key: string) {
  let property = target[key];

  const getter = () => {
    return property;
  }

  const setter = (newVal: any) => {
    console.log(`${key as string} changed from ${property} to ${newVal}`);
    property = newVal;
  }

  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    configurable: true,
    enumerable: true
  })

}
