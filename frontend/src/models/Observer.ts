export interface Observer<T> {
    update(data: T): void;
}

export class Subject<T> {
    private observers: Observer<T>[] = [];

    subscribe(observer: Observer<T>): void {
        this.observers.push(observer);
    }

    unsubscribe(observer: Observer<T>): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data: T): void {
        this.observers.forEach(obs => obs.update(data));
    }
}
