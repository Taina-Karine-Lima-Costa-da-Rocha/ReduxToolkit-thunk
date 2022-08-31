import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppThunk, RootState } from '../../app/store'

/*FAzendo um mock abaixo */
const fetchCount = (amount = 1) => {
    return new Promise<{ data: number }>(
        (resolve) => setTimeout(
            () => resolve({ data: amount }), 500
        )
    )
}

// Define a type for the slice state
export interface CounterState {
    value: number;
    status: 'idle' | 'loading' | 'failed'
}

// Define the initial state using that type
const initialState: CounterState = {
    value: 0,
    status: 'idle'
}

export const incrementAsync = createAsyncThunk(
    'counter/fetchCount',
    async (amount: number) => {
        const response = await fetchCount(amount)
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
)

export const counterSlice = createSlice({
    name: 'counter',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        increment: state => {
            state.value += 1
        },
        decrement: state => {
            state.value -= 1
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        }
    }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
    (amount: number): AppThunk =>
        (dispatch, getState) => {
            const currentValue = selectCount(getState());
            if (currentValue % 2 === 1) {
                dispatch(incrementByAmount(amount));
            }
        };

export default counterSlice.reducer