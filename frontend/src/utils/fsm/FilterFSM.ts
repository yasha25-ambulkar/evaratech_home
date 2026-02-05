export type FilterState = 'IDLE' | 'FILTERING' | 'EMPTY' | 'ERROR';

export interface FilterStateMachine {
    state: FilterState;
    transition(event: string): void;
}

export const createFilterFSM = (): FilterStateMachine => {
    let currentState: FilterState = 'IDLE';

    return {
        get state() { return currentState; },
        transition(event: string) {
            switch (currentState) {
                case 'IDLE':
                    if (event === 'START') currentState = 'FILTERING';
                    break;
                case 'FILTERING':
                    if (event === 'SUCCESS') currentState = 'IDLE';
                    if (event === 'NO_RESULTS') currentState = 'EMPTY';
                    if (event === 'FAIL') currentState = 'ERROR';
                    break;
                case 'EMPTY':
                    if (event === 'RESET') currentState = 'IDLE';
                    if (event === 'START') currentState = 'FILTERING';
                    break;
                case 'ERROR':
                    if (event === 'RETRY') currentState = 'FILTERING';
                    if (event === 'RESET') currentState = 'IDLE';
                    break;
            }
        }
    };
};
