const initialState = {
    stockLists: [],
    stockVolumes: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_COIN_PARAMS': 
            return {
                ...state,
                stockLists: action.payload.stockLists
            }
        case 'GET_TICKER_VOLUMNE':
            return {
                ...state,
                stockVolumes: action.payload.stockVolumes
            } 
        default:
            return state;
    }
}

export default reducer;