import { useState, useEffect } from 'react';
import DetailFig from './DetailFig';
import confetti from '../assets/confetti.svg'

export default function Dialog(props) {
    const dialogVer = props.activeDlg;
    const dataSet_holeSet = props.dataSet_holeSet;
    const selectedHole = props.selectedHole;
    const dataSet = props.dataSet;
    const [opacityStat, setOpacityStat] = useState(false)
    const curScore = props.curScore;

    useEffect(() => {
        setOpacityStat(props.activeDlg > 0)
    }, [props.activeDlg])

    const getAccuracy = () => {
        if ((curScore.good + curScore.bad) > 0) return `${(curScore.good * 100 / (curScore.bad + curScore.good)).toFixed(2)}%`;
        else return '--';
    }

    const getDialogTitle = () => {
        switch (dialogVer) {
            case 1: return 'Congratulations!'
            case 2: return 'Hole Detail'
            case 3: return 'My Accuracy'
            default: return 'Oops!'
        }
    }

    const getHoleDetail = () => {
        const dlgContent = [];
        const levs = ['grid', 'square', 'hole', 'micrograph']
        const imgSets = { grid: props.selectedHole.split('gr_')[0]+'gr', 
        square: props.selectedHole.split('sq')[0]+'sq', 
        hole: props.selectedHole.split('hl')[0]+'hl',
        micrograph: props.selectedHole }
        const selectedData=[dataSet?.[imgSets.grid]?.[imgSets.square+'_v02'], dataSet?.[imgSets.grid]?.[imgSets.square+'_v02']?.[imgSets.hole], dataSet?.[imgSets.grid]?.[imgSets.square+'_v02']?.[imgSets.hole]?.[props.selectedHole]]
        for (let imgIndex in levs) {
            dlgContent.push(<DetailFig url={imgSets[levs[imgIndex]]} dataSets={selectedData} imgIndex={imgIndex} imgLevel={levs[imgIndex]} />)
        }
        return <div id='fig_list'>
            <div className='fig_wrapper'>{dlgContent[0]}{dlgContent[1]}</div>
            <div className='fig_wrapper'>{dlgContent[2]}</div>
            <div className='fig_wrapper'>{dlgContent[3]}</div>
        </div>
    }

    const getDialogContent = () => {
        switch (dialogVer) {
            case 1: return <section className='text-center'>
                <img src={confetti} alt='' />
                <p>
                    <span style={{ fontSize: '18px' }}>
                        <b>Congratulations!</b>
                    </span>
                    <br />
                    You've successfully finished a session.
                </p>
            </section>
            case 2: return <section>
                {getHoleDetail()}
                <section>
                    CTFMaxRes: {dataSet_holeSet[selectedHole]?.ctf}
                </section>
            </section>
            case 3:
                console.log(curScore);
                return <section id='accuracy'>
                    <section>
                        <div className='smaller_text'>
                            Accuracy
                        </div>
                        <div className='acc_num'>
                            {getAccuracy()}
                            <span className='acc_detail'>({curScore.good}/{curScore.good + curScore.bad})</span>
                        </div>
                        <p>
                            You have made <b>{curScore.good} good selections</b> and <b>{curScore.bad} bad selections</b>. More evaluation will come in V.2 of this application.
                            {/* So far, median accuracy of 10 beginner trainees is 32%. */}
                        </p>
                    </section>
                    <section>
                        {/* [sample graph] */}
                    </section>
                </section>
            default: return 'Oops!'
        }
    }

    return (
        <div className={`dialog_bkdrop${opacityStat ? ' active' : ''}`} key={dialogVer === 1 ? 'congrat' : dialogVer === 2 ? 'detail' : 'accuracy'}>
            <div className='dialog' style={{ maxWidth: dialogVer === 2 ? '968px' : '768px' }}>
                <div className='dialog_title'>{getDialogTitle()}
                    {dialogVer !== 1 && <button className='icon_btn' key='dialog_close_btn'
                        onClick={() => { props.setActiveDlg(false) }}>
                        <svg focusable='false' aria-label='Close' width='20' height='20' viewBox='0 0 32 32' role='img'><path d='M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z'></path></svg>
                    </button>}
                </div>
                <section className='dialog_content'>
                    {getDialogContent()}
                </section>
                <div className='dialog_actions' key='dialog_action' style={{ display: dialogVer !== 1 ? 'none' : '' }}>
                    <button className='sqre_btn primary'
                        onClick={() => { props.resetSession() }}>Go Home</button>
                </div>
            </div>
        </div>
    )
}