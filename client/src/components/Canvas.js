import { useState, useEffect, forwardRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'
import { checkFileExist, postResults, unavlbl_img, requireFile } from '../utils'

export const Canvas = forwardRef((props, ref) => {
    const curImg = props.curImg;
    const dataSet_holeSet = props.dataSet_holeSet;
    const selectedList = props.selectedList;
    const sessionStat = props.sessionStat;
    const [total, setTotal] = useState(0)
    const [zoom, setZoom] = useState(1);
    const [baseWidth, setBaseWidth] = useState(1)

    useEffect(() => {
        if (!props.selectedList) props.updateSelectedImgs({})
    }, [props.curImg.holeSet, props.selectedList])

    useEffect(() => {
        setBaseWidth(ref?.current?.naturalWidth ? ref.current.naturalWidth : 924)
    }, [ref?.current?.naturalWidth])

    const mapToCenterOrigin = (pos) => {
        return pos + (baseWidth/2)
    }

    const select = (key, ctfVal, pos) => {
        pos = pos.map(corner => corner.map(point => mapToCenterOrigin(point)))

        if (!selectedList || !selectedList[key]) {
            props.updateSelectedImgs({ [key]: { ctf: ctfVal, order: total, corner_pos: pos } }, {
                image_id: key,
                ctf: ctfVal,
                is_right_answer: ctfVal <= 6
            })
            setTotal(prev => prev + 1)
            props.setTotalSelected(prev => prev + 1)
            props.addData(props.action_id, key, ctfVal, ctfVal <= 6)
        }
    }

    const getSize = (item) => {
        const mapToCenterOrigin = (pos) => {
            return pos + (baseWidth/2)
        }

        return {
            left: (mapToCenterOrigin(item?.corner_pos[0][0]) * 100 / baseWidth) + '%',
            top: (mapToCenterOrigin(item?.corner_pos[0][1]) * 100 / baseWidth) + '%',
            width: zoom * (item?.corner_pos[1][0] - item?.corner_pos[0][0]) + 'px',
            height: zoom * (item?.corner_pos[1][0] - item?.corner_pos[0][0]) + 'px'
        }
    }

    return (
        <div>
            <div id='main_view' style={{ width: 'calc(100% - 250px)', height: 'calc(100vh - 49px)' }}>
                <ScrollContainer className='scroll-container' id='main_image_container' style={{ width: '100%', height: '100%' }} key='scroll_container'>
                    <div id='bbox' key='bbox' style={{ width: baseWidth * zoom }}>
                        {
                            checkFileExist(curImg.holeSet) ?
                            // <img id='main_image' src={checkFileExist(curImg.holeSet).default} key='main_image' alt='' ref={ref} /> :
                            <img id='main_image' src={requireFile(curImg.holeSet)} key='main_image' alt='' ref={ref} /> :
                            unavlbl_img({ color: '#fff', padding: '50%' })
                        }

                        {dataSet_holeSet && Object.entries(dataSet_holeSet).map((item) =>
                            item[1] && item[0] !== 'corner_pos' &&
                            <div className={`new_selection${sessionStat ? ' active' : ''}${selectedList?.[item[0]] ? ' noresult' : ''}`}
                                id={`hole${item[0]}`} key={`hole${item[0]}`}
                                onClick={() => { if (sessionStat) select(item[0], item[1].ctf, item[1].corner_pos) }}
                                style={getSize(item[1])}
                            >
                                {selectedList?.[item[0]] && <div className='new_selection_order'>{selectedList[item[0]].order + 1}</div>}
                            </div>
                        )}
                    </div>
                </ScrollContainer >
            </div>

            <div className={`image_zoom${props.footerStat ? ' float' : ''}`}>
                <button className='cursor-pointer' onClick={() => { setZoom(zoom * 1.1) }}><i className='fa fa-plus' aria-hidden='true'></i></button>
                <button className='cursor-pointer' onClick={() => { setZoom(zoom * 0.9) }}><i className='fa fa-minus' aria-hidden='true'></i></button>
            </div>
        </div>
    )
})