import { checkFileExist, requireFile } from '../utils';

export default function SidebarThumb(props) {
    return (
        <div className='side-thumb-wrppr'>
            {/* {checkFileExist(props.imgId) && <img src={checkFileExist(props.imgId).default} style={{left: -1 * (props.item.corner_pos[0][0]) + 'px',  top: -1 * (props.item.corner_pos[0][1]) + 'px'}} key={`${props.imgId}_${props.item.corner_pos[0][0]}_${props.item.corner_pos[0][1]}_thumb`} alt=''/>} */}
            {checkFileExist(props.imgId) && <img src={requireFile(props.imgId)} style={{left: -1 * (props.item.corner_pos[0][0]) + 'px',  top: -1 * (props.item.corner_pos[0][1]) + 'px'}} key={`${props.imgId}_${props.item.corner_pos[0][0]}_${props.item.corner_pos[0][1]}_thumb`} alt=''/>}
    </div>)
}