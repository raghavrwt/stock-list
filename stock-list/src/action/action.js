import { fetchCoinParams, fetchTickerVolume } from '../apiCalls/api'; 

export const getCoinParams = () => {
    return async (dispatch) => {
        const response = await fetchCoinParams()
        const data = response[0];
        dispatch({
            type: 'GET_COIN_PARAMS',
            payload: { stockLists: data }
        })
        return data;
    }
}

export const getTickerWithVolume = () => {
    return async (dispatch) => {
        const response = await fetchTickerVolume();
        dispatch({
            type: 'GET_TICKER_VOLUMNE',
            payload: { stockVolumes: response }
        })
        return response;
    }
}