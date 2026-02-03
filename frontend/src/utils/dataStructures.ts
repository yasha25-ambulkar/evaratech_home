// LRU Cache implementation for API response caching
export class LRUCache<K, V> {
    private cache: Map<K, V>;
    private capacity: number;

    constructor(capacity: number = 100) {
        this.cache = new Map();
        this.capacity = capacity;
    }

    get(key: K): V | undefined {
        if (!this.cache.has(key)) return undefined;

        // Move to end (most recently used)
        const value = this.cache.get(key)!;
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value as K;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, value);
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }

    clear(): void {
        this.cache.clear();
    }

    get size(): number {
        return this.cache.size;
    }
}

// Priority Queue for notifications
export class PriorityQueue<T> {
    private heap: Array<{ priority: number; item: T }>;

    constructor() {
        this.heap = [];
    }

    enqueue(item: T, priority: number): void {
        this.heap.push({ priority, item });
        this.bubbleUp(this.heap.length - 1);
    }

    dequeue(): T | undefined {
        if (this.heap.length === 0) return undefined;

        const min = this.heap[0];
        const last = this.heap.pop()!;

        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }

        return min.item;
    }

    peek(): T | undefined {
        return this.heap[0]?.item;
    }

    get size(): number {
        return this.heap.length;
    }

    private bubbleUp(index: number): void {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority >= this.heap[parentIndex].priority) break;

            [this.heap[index], this.heap[parentIndex]] =
                [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    private bubbleDown(index: number): void {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length &&
                this.heap[leftChild].priority < this.heap[minIndex].priority) {
                minIndex = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.heap[rightChild].priority < this.heap[minIndex].priority) {
                minIndex = rightChild;
            }

            if (minIndex === index) break;

            [this.heap[index], this.heap[minIndex]] =
                [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
}

// Trie for autocomplete search
class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    suggestions: string[];

    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.suggestions = [];
    }
}

export class Trie {
    private root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string): void {
        let node = this.root;
        for (const char of word.toLowerCase()) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char)!;
            if (node.suggestions.length < 10) {
                node.suggestions.push(word);
            }
        }
        node.isEndOfWord = true;
    }

    search(prefix: string): string[] {
        let node = this.root;
        for (const char of prefix.toLowerCase()) {
            if (!node.children.has(char)) return [];
            node = node.children.get(char)!;
        }
        return node.suggestions;
    }

    clear(): void {
        this.root = new TrieNode();
    }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>): ReturnType<T> => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    }) as T;
}
