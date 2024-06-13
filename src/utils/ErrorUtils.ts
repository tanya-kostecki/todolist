import {Dispatch} from "redux";
import {ResponseType} from "../api/api";
import {setAppStatus, setErrorAC} from "../model/app-reducer";

export const handleNetworkServerError = (dispatch: Dispatch, err: { message: string}) => {
    dispatch(setErrorAC(err.message))
    dispatch(setAppStatus('failed'))
}

export const handleAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC('Something went wrong'))
    }
    dispatch(setAppStatus('failed'))
}