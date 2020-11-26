const variable = {
    foo: 'hello',
    bar: 42,
    step: true
};

function replaceKey<T, OldProp extends keyof T, NewProp extends string>(obj: T, oldProp: OldProp, newProp: NewProp) {
    const {
        [oldProp]: id,
        ...rest
    } = obj;

    return {
        ...rest,
        [newProp]: id
    } as Omit<T, OldProp> & Record<NewProp, T[OldProp]>;
}
var a = replaceKey(variable, "foo", "foo_new").foo_new;

interface TypeMap {
    undefined: undefined;
    object: object;
    boolean: boolean;
    number: number;
    bigint: bigint;
    string: string;
    symbol: symbol;
    function(...args: any[]): any;
}

function isType<T extends keyof TypeMap>(
    value: any,
    type: T 
): value is TypeMap[T] {
    return typeof value === type;
}