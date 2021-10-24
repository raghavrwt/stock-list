export const fetchCoinParams = () => {
    return fetch('https://bitbns.com/jugApi/coinParams.json').then(response => {
        return response.json();
    }).then(res => {
        const { status, data } = res[0];
        if (status !== 1) {
            return {
                isSuccess: false
            }
        }
        return data;
    })
}

export const fetchTickerVolume = () => {
    return fetch('https://bitbns.com/order/getTickerWithVolume/').then(response => {
        return response.json();
    }).then(res => {
        return res;
    })
}