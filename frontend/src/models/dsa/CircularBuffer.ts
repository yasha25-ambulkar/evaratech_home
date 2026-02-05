export class CircularBuffer<T> {
    private buffer: (T | null)[];
    private head: number = 0;
    private tail: number = 0;
    private size: number = 0;
    private capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.buffer = new Array(capacity).fill(null);
    }

    push(item: T): void {
        if (this.size === this.capacity) {
            // Overwrite oldest (head moves)
            this.buffer[this.head] = item;
            this.head = (this.head + 1) % this.capacity;
            this.tail = (this.tail + 1) % this.capacity; // Tail also moves to stay in sync?? 
            // Actually standard implementation:
            // If full, overwrite head, move head.
            // But usually we append to tail.

            // Let's implement simpler overwrite behavior:
            // We write to current pointer.
            // But standard Circular Buffer (Ring Buffer) logic:
            // writeIndex = (writeIndex + 1) % capacity.
        } else {
            this.size++;
            // this.buffer[this.tail] = item;
            // this.tail = (this.tail + 1) % this.capacity;
        }

        // Re-thinking simpler array backing for "push and keep last N":
        // This is primarily for Charts where we want [t-N, ... , t].
        // If we want to maintain order easily for charts without re-mapping every time:
        // A simple array shift/push might be O(N) but for N=100 it's fast.
        // Circular buffer avoids O(N) shift.
        // But extracting to array for Recharts is O(N) anyway.

        // Let's stick to the concept:
        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        if (this.size < this.capacity) {
            // size increased
        } else {
            this.head = (this.head + 1) % this.capacity; // Head moves forward if full
        }
    }

    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;
        for (let i = 0; i < this.size; i++) {
            const item = this.buffer[current];
            if (item !== null) result.push(item);
            current = (current + 1) % this.capacity;
        }
        return result;
    }

    get length(): number {
        return this.size;
    }
}
