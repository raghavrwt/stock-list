import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import PageLayout from '../common/PageLayout';
import { getCoinParams, getTickerWithVolume } from '../action/action';

import '../styles/listing-page.css';

const initialDir = {
    "last_traded_price": null,
    "percentage": null,
    "volume": null
}

const ListingPage = (props) => {

    const [initialData, setInitialData] = useState([])
    const [tableData, setTableData] = useState([])
    const [direction, setDirection] = useState(initialDir)

    useEffect(() => {
        Promise.all([
            props.getCoinParams(),
            props.getTickerWithVolume()
        ]).then(([stockLists, stockVolumes]) => {
            const filteredStocks = Object.keys(stockLists).map(list => {
                if (Object.keys(stockVolumes).includes(list.toUpperCase())) {
                    if (localStorage.getItem("favs") && JSON.parse(localStorage.getItem("favs")).includes(list)) {
                        return { 
                            ...stockLists[list], 
                            ...stockVolumes[list.toUpperCase()], 
                            percentage: (stockVolumes[list.toUpperCase()].last_traded_price - stockVolumes[list.toUpperCase()].yes_price) * 100 / stockVolumes[list.toUpperCase()].yes_price,
                            code: list, 
                            fav: true 
                        }    
                    }
                    return { 
                        ...stockLists[list], 
                        ...stockVolumes[list.toUpperCase()], 
                        percentage: (stockVolumes[list.toUpperCase()].last_traded_price - stockVolumes[list.toUpperCase()].yes_price) * 100 / stockVolumes[list.toUpperCase()].yes_price,
                        code: list, 
                        fav: false 
                    }
                }
                return false
            }).filter(item => item !== false && item.yes_price !== undefined && item.yes_price !== 0 && item.yes_price !== null)

            setInitialData(filteredStocks)
            setTableData(filteredStocks)
        })
        // eslint-disable-next-line
    }, [])

    const onHandleChange = (e) => {
        const { value } = e.target;
        const filterTableData = initialData.filter(item => {
            return item.coinName.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.code.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
        setTableData(filterTableData)
    }

    const onFavClick = (id) => {
        const filterData = tableData.map(item => {
            if (item.coinId === id) {
                if (item.fav) {
                    return {
                        ...item,
                        fav: false
                    }
                } 
                return {
                    ...item,
                    fav: true
                }
                
            } else {
                return {
                    ...item
                }
            }
        })

        let setFav = [];
        filterData.forEach(item => {
            if (item.fav) {
                setFav.push(item.code)
            }
        })

        localStorage.setItem("favs", JSON.stringify(setFav));
  
        const initData = initialData.map(item => {
            if (setFav.includes(item.code)) {
                return {
                    ...item,
                    fav: true
                }
            } else {
                return {
                    ...item,
                    fav: false
                }
            }
        })
        setInitialData(initData)
        setTableData(filterData)
    }

    const compareByAsc = (key) => {
        if (key === 'last_traded_price' || key === 'percentage') {
            const direction = key === 'last_traded_price' ? { ...initialDir, 'last_traded_price': 'asc' } : { ...initialDir, 'percentage': 'asc' } 
            setDirection(direction)
            return function(a, b) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
                return 0;
            };
        } else if (key === 'volume') {
            const direction = { ...initialDir, 'volume': 'asc' }
            setDirection(direction)
            return function (a, b) {
                if (a[key].volume < b[key].volume) return -1;
                if (a[key].volume > b[key].volume) return 1;
                return 0;
            }
        }
    }

    const compareByDesc = (key) => {
        if (key === 'last_traded_price' || key === 'percentage') {
            const direction = key === 'last_traded_price' ? { ...initialDir, 'last_traded_price': 'desc' } : { ...initialDir, 'percentage': 'desc' } 
            setDirection(direction)
            return function(a, b) {
                if (a[key] < b[key]) return 1;
                if (a[key] > b[key]) return -1;
                return 0;
            };
        } else if (key === 'volume') {
            const direction = { ...initialDir, 'volume': 'desc' }
            setDirection(direction)
            return function (a, b) {
                if (a[key].volume < b[key].volume) return 1;
                if (a[key].volume > b[key].volume) return -1;
                return 0;
            }
        }
    }
    
    const sortBy = (key) => {
        let arrayCopy = [...tableData];
        const arrInStr = JSON.stringify(arrayCopy);
        arrayCopy.sort(compareByAsc(key));
        const arrInStr1 = JSON.stringify(arrayCopy);
        if (arrInStr === arrInStr1) {
        arrayCopy.sort(compareByDesc(key));
        } 
        setTableData(arrayCopy)
    }

    return (
        <PageLayout>
            <div className="coin-container">
                <div className="input-field">
                    <i className="fa fa-search icon"></i>
                    <input className="input" type="text" onChange={onHandleChange} placeholder="Search Coins"></input>
                </div>
                <div style={{overflowX: 'auto'}}>
                    <table className="stock-list">
                        <thead>
                            <tr>
                                <th className="sticky-col" style={{ backgroundColor: '#f1f2f5'}}>Coins</th>
                                <th onClick={() => sortBy("last_traded_price")}>
                                    <div className="head">
                                        <i className={direction["last_traded_price"] ? (direction["last_traded_price"] === 'desc' ? 'fa fa-sort-desc' : 'fa fa-sort-asc') : ''  }></i>
                                        Price
                                    </div>
                                </th>
                                <th onClick={() => sortBy("volume")}>
                                    <div className="head">
                                        <i className={direction["volume"] ? (direction["volume"] === 'desc' ? 'fa fa-sort-desc' : 'fa fa-sort-asc') : ''  }></i>
                                        Volume
                                    </div>
                                </th>
                                <th onClick={() => sortBy("percentage")}>
                                <div className="head">
                                        <i className={direction["percentage"] ? (direction["percentage"] === 'desc' ? 'fa fa-sort-desc' : 'fa fa-sort-asc') : ''  }></i>
                                        24H %
                                    </div>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { tableData.length > 0 && tableData.map((item) => {
                                const { coinId, coinName, volume, last_traded_price, percentage, fav, coinIcon, code, coinType} = item
                                return (
                                    <tr key={coinId}>
                                        <td className="sticky-col">
                                            <div className="coin-name">
                                                <Link to={{ 
                                                pathname: `/${code}`, 
                                                detailData: { 
                                                    coinId, 
                                                    coinName, 
                                                    coinIcon, 
                                                    coinType 
                                                }
                                                }}> 
                                                
                                                    <img style={{ marginRight: '6px'}} src={coinIcon} alt={`${code}-icon`} height="20" widht="20"></img>{coinName}
                                                </Link>
                                            </div>
                                        </td>
                                        <td>{last_traded_price}</td>
                                        <td>
                                        {Math.round((volume.volume || 0) * 100)/ 100}
                                        </td>
                                        <td>
                                            <div className={`percentage ${percentage > 0 ? 'green' : 'red'}`}>
                                                <i className={percentage > 0 ? "fa fa fa-long-arrow-up green" : "fa fa fa-long-arrow-down red"}></i>
                                                {Math.abs(Math.round(percentage * 100) / 100)}
                                            </div>
                                        </td>
                                        <td><span onClick={() => onFavClick(coinId)} className={fav ? "fa fa-star yellow" : "fa fa-star-o "}></span></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageLayout>
    )
}

const mapStateToProps = (state, props) => ({
    ...props
})

export default connect(mapStateToProps, {
    getCoinParams,
    getTickerWithVolume
})(ListingPage);