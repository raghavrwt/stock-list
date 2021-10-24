import React, { useEffect, useState } from 'react'
import PageLayout from '../common/PageLayout'
import { connect } from 'react-redux';
import { getCoinParams } from '../action/action';

import '../styles/detail-page.css';

const DetailPage = (props) => {

    const [detailData, setDetailData] = useState({})

    useEffect(() => {
        let itemData = []
        const { detailData } = props.location
        if (detailData) {
            setDetailData(detailData)
        }
        if (!detailData) {
            props.getCoinParams().then(resp => {
                Object.keys(resp).forEach(item => {
                    if (item === props.match.params.id) {
                        itemData.push(resp[item])
                    } 
                })
                setDetailData(itemData[0])
            })
        }
        // eslint-disable-next-line
    }, [])

    return (
        <PageLayout>
            <div className="detail-container">
                <img src={detailData.coinIcon} alt="coin-icon"></img>
                <h1 style={{ margin: '0px auto', color: 'purple' }}>{detailData.coinName}</h1>
            </div> 
        </PageLayout>
    )
}

export default connect(null, {
    getCoinParams
})(DetailPage);