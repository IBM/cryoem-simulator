import { useState, useEffect } from 'react';
import SidebarThumb from './SidebarThumb';
import { checkFileExist, requireFile } from '../utils'

export default function Sidebar(props) {
    const thumbList = props.selectedList;
    const [qOrder, setQOrder] = useState(0)
    const [sortStat, setSortStat] = useState(false)
    const [sortOrder, setSortOrder] = useState(0)

    useEffect(() => {
        if (props.mode) {
            let entries = {}
            Object.entries(thumbList).map(val => Object.assign(entries, val[1]))
            setQOrder(Object.keys(entries).length)
        }
    }, [props.mode])

    useEffect(() => {
        if (props.mode) setQOrder(prev => prev + 1)
    }, [thumbList])

    const listSelected = () => {
        let entries = {}
        Object.entries(thumbList).map(val => Object.assign(entries, val[1]))
        let keyList = Object.keys(entries);

        switch (sortOrder) {
            case 0: keyList.sort((item1, item2) => entries[item2].order - entries[item1].order); break;
            case 1: keyList.sort((item1, item2) => entries[item2].ctf - entries[item1].ctf); break;
            default:
        }

        let thumbListDom = [];
        const getImg = (item) => {
            return checkFileExist(item.replace('en-a', 'fa')) ?
                <img key={`selected_${item.replace('en-a', 'fa')}_img`}
                    // src={checkFileExist(item.replace('en-a', 'fa')).default} alt='' />
                    src={requireFile(item.replace('en-a', 'fa'))} alt='' />
                : <SidebarThumb item={entries[item]} imgId={item.split('hl')[0]+'hl'} />
        }
        for (let item of keyList) {
            thumbListDom.push(
                <div className='selected' key={`selected_${item}`}>
                    <div>
                        <p className={`selection_order`}>{entries[item].order + 1}</p>
                        {entries[item].order < qOrder && <p className='ctf_score'>CTFMaxRes:<br />{entries[item].ctf}
                        </p>}
                    </div>
                    <div>
                        {entries[item].order < qOrder ?
                            <div className='sidebar_thumb_wrapper inspect'
                                onClick={() => { props.setSelectedHole(item); props.setActiveDlg(2) }}
                                aria-label='View Hole Detail'>
                                {getImg(item)}
                                <div className='thumb_overlay'>
                                    <i className='fa fa-search-plus'></i>
                                </div>
                            </div> :
                            <div className='sidebar_thumb_wrapper' aria-label='Selected Hole'>
                                {getImg(item)}
                            </div>
                        }

                    </div>
                </div>)
        }
        return thumbListDom
    }

    return (
        <div id='selection'>
            <div className='selection_top'>
                <p><b>Selected Holes</b></p>
                <div>
                    <div className='sorting_button itip'>
                        <button aria-label='mode toggle' className='selection_sort cursor-pointer' key='mode-toggle' onClick={() => { props.setMode(!props.mode) }}>
                            {props.mode ? <i className='fa fa-eye' aria-hidden='true' key='mode-toggle-true'></i> :
                                <i className='fa fa-eye-slash' aria-hidden='true' key='mode-toggle-false'></i>}
                        </button>
                        <span style={{ padding: '.5rem 1rem', marginLeft: '-15px', width: '92px', textAlign: 'center' }}>{props.mode ? 'Inspection' : 'Queueing'} Mode</span>
                    </div>
                    <div className='sorting_button'>
                        <button aria-label='sort sidebar' className='selection_sort cursor-pointer' onClick={() => { setSortStat(!sortStat) }}>
                            <i className='fa fa-sort-amount-desc' aria-hidden='true'></i>

                        </button>
                        <div id='selection_dropdown' className={sortStat ? 'active' : ''}>
                            <div className='cursor-pointer' aria-label='by select order' onClick={() => { setSortOrder(0) }}>Sort by Select Order</div>
                            <div className='cursor-pointer' aria-label='by ctf' onClick={() => { setSortOrder(1) }}>Sort by CTFMaxRes</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='selected'>
                {thumbList && Object.keys(thumbList).length > 0 ? listSelected() : <div style={{ paddingTop: '1rem' }}>Nothing Selected</div>}
            </div>
        </div>
    )
}