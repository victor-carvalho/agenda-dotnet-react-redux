import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { fetch } from "../Utils";
import * as Models from "./Models";

export interface PessoasState {
    data: Models.Pessoa[];
    loading: boolean;
}

interface RequestPessoasAction {
    type: "REQUEST_PESSOAS";
}

interface ReceivePessoasAction {
    type: "RECEIVE_PESSOAS";
    data: Models.Pessoa[];
}

interface RemovePessoaAction {
    type: "REMOVE_PESSOA";
    id: number;
}

type KnownAction =
    | RequestPessoasAction
    | ReceivePessoasAction
    | RemovePessoaAction;

export const actionCreators = {
    fetchPessoas: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        fetch("/api/pessoas", undefined, true)
            .then(r => r.json())
            .then(data => {
                dispatch({ type: "RECEIVE_PESSOAS", data });
            });
        dispatch({ type: "REQUEST_PESSOAS" });
    },
    removePessoa: (id: number): AppThunkAction<KnownAction> => (
        dispatch,
        getState
    ) => {
        fetch(`/api/pessoas/${id}`, { method: "DELETE" }).then(() => {
            dispatch({ type: "REMOVE_PESSOA", id });
        });
    }
};

const initialState = { data: [], loading: false };

export const reducer: Reducer<PessoasState> = (
    state = initialState,
    action: KnownAction
) => {
    switch (action.type) {
        case "REQUEST_PESSOAS":
            return { ...state, loading: true };
        case "RECEIVE_PESSOAS":
            return { loading: false, data: action.data };
        case "REMOVE_PESSOA":
            return {
                ...state,
                data: state.data.filter(p => p.id != action.id)
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }
    return state;
};
