interface Type<T> {
    new(...args: any[]): T;
}

export type GenericClassDecorator<T> = (target: T) => void;

export const Injector = new class {
    // resolving instances
    resolve<T>(target: Type<any>): T {
        // tokens are required dependencies, while injections are resolved tokens from the Injection
        let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
            injections = tokens.map(token => Injector.resolve<any>(token));

        return new target(...injections);
    }
};

export const Service = () : GenericClassDecorator<Type<object>> => {
    return (target: Type<object>) => {
        // do something with `target`, e.g. some kind of validation or passing it to the Injector and store them
    };
};