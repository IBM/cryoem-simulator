import { useEffect, useState, createRef } from 'react';
import { checkFileExist, requireFile } from '../utils'

export default function DetailFig(props) {
    const imageRef = createRef(null)
    const imgUrl = props.url;
    const imgIndex = props.imgIndex;
    const imgLevel = props.imgLevel
    const zoom = ['120x', '500x', '800x', '5kx']
    const [pos_left, setPos_left] = useState(null);
    const [pos_top, setPos_top] = useState(null);
    const [sqreWidth, setSqreWidth] = useState(null);

    useEffect(() => {
        if (imageRef.current) {
            const baseWidth = imageRef.current.naturalWidth
            setPos_left((props.dataSets[imgIndex]?.corner_pos[0][0] + (baseWidth / 2)) * 100 / baseWidth - 0.5);
            setPos_top((props.dataSets[imgIndex]?.corner_pos[0][1] + (baseWidth / 2)) * 100 / baseWidth - 0.5);
            setSqreWidth((props.dataSets[imgIndex]?.corner_pos[1][0] - props.dataSets[imgIndex]?.corner_pos[0][0]) * 100 / imageRef.current.naturalHeight * 1.1)
        }
    }, [imageRef, props.dataSets])

    return (<figure key={`detail_${imgLevel}`}>
        <div className='fig_pos_wrapper'>
            {checkFileExist(imgUrl) ?
                // <img key={`detail_img_${imgLevel}`} src={checkFileExist(imgUrl).default} alt={`${imgLevel} level`} ref={imageRef} />
                <img key={`detail_img_${imgLevel}`} src={requireFile(imgUrl)} alt={`${imgLevel} level`} ref={imageRef} />
                : <div className='unavailable_img'>Image unavailable</div>
            }
            {imgIndex < 3 && <div className='pos_sqre' key={`pos_sqre_${imgLevel}`}
                style={{
                    left: `${pos_left}%`,
                    top: `${pos_top}%`,
                    width: `${sqreWidth}%`
                }}
            ></div>}
        </div>
        <figcaption>
            <span key={`img_lev_${imgLevel}`} style={{ textTransform: 'capitalize' }}> {imgLevel === 'hole' ? 'patch' : imgLevel} Level</span>
            <span key={`img_zoom_${imgLevel}`}>{zoom[imgIndex]}</span>
        </figcaption>
    </figure>)

}