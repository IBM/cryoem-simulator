import { useState, useEffect } from 'react';
import { checkFileExist, unavlbl_img, requireFile } from '../utils'

export default function NavDialog(props) {
    const dataSet = props.dataSet;

    const [baseWidth, setBaseWidth] = useState(1);
    const [screenWidth, setScreenWidth] = useState(1)
    const [opacityStat, setOpacityStat] = useState(false)
    const [gridList, setGridList] = useState('')
    const [sqreList, setSqreList] = useState('');
    const [holeSetList, setHoleSetList] = useState('');
    const [activeNav, setActiveNav] = useState(2);
    const [tempCurImg, setTempCurImg] = useState({ grid: props.curImg.grid, sqre: props.curImg.sqre, holeSet: props.curImg.holeSet })

    const levels = ['Atlas', 'Grid', 'Square', 'Patch']
    const levs = ['grid', 'sqre', 'holeSet']
    const listItems = [gridList, sqreList, holeSetList]

    useEffect(() => {
        const base = Math.min(window.innerWidth * 0.9 - 16 * 9.25 - 190, window.innerHeight * 0.7)
        setBaseWidth(base)
        setScreenWidth(Math.min(window.innerWidth * 0.9, base + 230 + 9.25 * 16))
    }, [])

    useEffect(() => {
        setOpacityStat(props.navDlg !== false)
    }, [props.navDlg])

    useEffect(() => {
        setGridList(Object.keys(dataSet));
    }, [dataSet])

    useEffect(() => {
        updateList(0);
        setTempCurImg(prev => ({ ...prev, grid: props.curImg.grid }))
    }, [props.curImg.grid])

    useEffect(() => {
        updateList(1);
        setTempCurImg(prev => ({ ...prev, sqre: props.curImg.sqre }))
    }, [props.curImg.sqre])

    useEffect(() => {
        updateList(1);
        setTempCurImg(prev => ({ ...prev, holeSet: props.curImg.holeSet }))
    }, [props.curImg.holeSet])

    useEffect(() => {
        setActiveNav(props.navDlg)
    }, [props.navDlg])

    const getPos = (idx) => {
        const list = idx < 2 ? dataSet[tempCurImg.grid] : dataSet[tempCurImg.grid][tempCurImg.sqre]
        const mapToCenterOrigin = (pos) => {
            return pos + 462
        }
        if (list) {
            return Object.entries(list)?.map((item) => {
                if (item[0] !== 'corner_pos') {
                    const width = (item[1]?.corner_pos[1][0] - item[1]?.corner_pos[0][0])
                    const ratio = idx < 2 ? 1.7 : 2.1
                    const style = {
                        left: `${((mapToCenterOrigin(item[1]?.corner_pos[0][0]) - width * (ratio - 1) / 2) * 100 / 924)}%`,
                        top: `${((mapToCenterOrigin(item[1]?.corner_pos[0][1]) - width * (ratio - 1) / 2) * 100 / 924)}%`,
                        width: width * 100 / 924 * ratio + '%',
                        height: width * 100 / 924 * ratio + '%'
                    }
                    const visited = props.selectedImgs &&
                        Object.keys(props.selectedImgs).map(val => idx < 2 ? val.split('sq')[0] + 'sq_v02' : val).includes(item[0])
                    return (<div className={`new_selection ${visited ? idx < 2 ? 'op-50 itip active' : 'op-50 itip' : 'active'} ${tempCurImg[levs[idx]] === item[0] ? ' cur' : ''}`}
                        key={`nav_${idx}_${item[0]}`} style={style}
                        onClick={() => {
                            if (idx < 2 || !visited) {
                                setTempCurImg(prev => ({ ...prev, [levs[idx]]: item[0] }))
                                updateList(idx);
                                if (idx < 2) setActiveNav(idx * 1 + 1)
                            }
                        }}>
                        {visited && <span>You've visited this {levels[idx * 1 + 1].toLowerCase()}</span>}
                    </div>)
                }
                return ''
            })
        }
    }

    const updateList = (lev) => {
        for (let i = lev * 1 + 1; i < 3; i++) {
            let keys = i === 1 ? Object.keys(dataSet[tempCurImg.grid]) : (dataSet[tempCurImg.grid][tempCurImg.sqre] ? Object.keys(dataSet[tempCurImg.grid][tempCurImg.sqre]) : []);
            keys.pop()
            i === 1 ? setSqreList([...keys]) : setHoleSetList([...keys]);
            setTempCurImg(prev => ({ ...prev, [levs[i]]: -1 }))
        }
    }

    const updateCurImg = () => {
        props.setCurImg(prevState => ({ ...prevState, ...tempCurImg }))
    }

    const buildNavList = (idx) => {
        switch (idx * 1) {
            case 0:
                return <div className='thumb_list_scroll_wrapper'>
                    <div className='thumb_list'>
                        {gridList.map((item) => {
                            const visited = props.selectedImgs && Object.keys(props.selectedImgs).map(val => val.split('gr_')[0] + 'gr').includes(item)

                            return <div className={`thumb_img_wrapper${tempCurImg.grid === item ? ' active' : ''}${visited ? ' op-50 itip' : ''}`}
                                onClick={() => {
                                    setTempCurImg(prev => ({ ...prev, grid: item }))
                                    updateList(idx);
                                    setActiveNav(idx * 1 + 1)
                                }}
                                key={`thumb_img_wrapper_${idx}_${item}`}
                            >
                                {visited && <span>You've visited this grid</span>}
                                {checkFileExist(item) ?
                                    <img className='cursor-pointer' 
                                        alt={`${item}`}
                                        // src={checkFileExist(item).default}
                                        src={requireFile(item)}
                                        key={`thumb_list_img_${idx}_${item}`} /> :
                                    unavlbl_img()
                                }
                            </div>
                        })}
                    </div>
                </div>
            default: return <div id='nav_bbox' key='nav_bbox' style={{ width: baseWidth, height: baseWidth }}>
                {
                    checkFileExist(tempCurImg[levs[idx - 1]]) ?
                        // <img className='nav-main-img' src={checkFileExist(tempCurImg[levs[idx - 1]]).default} key='nav_2_main_image' alt='' /> :
                        <img className='nav-main-img' src={requireFile(tempCurImg[levs[idx - 1]])} key='nav_2_main_image' alt='' /> :
                        unavlbl_img({ color: '#fff', padding: '50%' })
                }
                {getPos(idx)}

            </div>
        }
    }
    const buildNav = () => {
        let dropUp = [];
        for (let indexNum in listItems) {
            if (listItems[indexNum]) {
                dropUp.push(
                    <div className={`thumb_nav ${indexNum - activeNav === 0 ? 'active' : ''}`} key={`thumb_nav${indexNum}`}>
                        <div className='thumb_wrapper cursor-pointer' onClick={() => { setActiveNav(indexNum) }}>
                            <div>{levels[indexNum * 1 + 1]}</div>
                            {tempCurImg[levs[indexNum]] !== -1 ?
                                checkFileExist(tempCurImg[levs[indexNum]]) ?
                                    // <img src={checkFileExist(tempCurImg[levs[indexNum]]).default} key={`thumb_wrapper_img_${indexNum}`} alt={`current ${levs[indexNum]} level`} /> : unavlbl_img()
                                    <img src={requireFile(tempCurImg[levs[indexNum]])} key={`thumb_wrapper_img_${indexNum}`} alt={`current ${levs[indexNum]} level`} /> : unavlbl_img()
                                : <div className='unavailable_img'>Not Selected</div>}
                            {tempCurImg[levs[indexNum]] !== -1 && <div>
                                <i className='fa fa-check-circle' aria-hidden='true'></i>
                            </div>}
                        </div>
                        <div className='thumb_list_wrapper row'>
                            <div className='thumb_list_scroll_overflow_wrapper' key={`thumb-list-scroll${indexNum}`} style={{ flex: `0 0 ${screenWidth - 16 * 9.25}px` }}>
                                <div className='thumb-des body-short-01' key={`thumb-des-body${indexNum}`}>
                                    <span className='heading-03'>{levels[indexNum * 1 + 1]}</span><br />
                                    Select a {levels[indexNum * 1 + 1].toLowerCase()} from the {levels[indexNum].toLowerCase()}
                                </div>
                                {buildNavList(indexNum)}
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return dropUp
    }


    return (
        <div className={`dialog_bkdrop${opacityStat ? ' active' : ''}`} key='navDialog'>
            <div className='dialog' style={{ padding: '0', height: baseWidth + 96 + 'px', width: screenWidth }}>
                <section className='dialog_content row' style={{ marginBottom: '1rem', overflowX: 'hidden' }}>
                    {buildNav()}
                </section>
                <div className='dialog_actions' key='dialog_action' style={{ margin: 0 }}>
                    {props.sessionStat === 3 && <button className='sqre_btn secondary'
                        onClick={() => { props.setNavDlg(false) }}>Cancel</button>}
                    <button className='sqre_btn primary' disabled={Object.values(tempCurImg).includes(-1)}
                        onClick={() => { updateCurImg(); props.setNavDlg(false); if (props.sessionStat === 2) props.setSessionStat(3) }}>Select</button>
                </div>
            </div>
        </div>
    )
}