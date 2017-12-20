import * as Pessoas from "./Pessoas";

export interface ApplicationState {
    pessoas: Pessoas.PessoasState;
}

export const reducers = {
    pessoas: Pessoas.reducer
};

export interface AppThunkAction<TAction> {
    (
        dispatch: (action: TAction) => void,
        getState: () => ApplicationState
    ): void;
}
