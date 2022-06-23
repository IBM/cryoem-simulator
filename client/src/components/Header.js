import { useState, useEffect } from 'react';

export default function Header(props) {
    const sessionStat = props.sessionStat;
    const totalSelected = props.totalSelected;
    const [timer, setTimer] = useState([0, 0, 0])

    useEffect(() => {
        if (sessionStat) {
            setTimeout(() => {

                props.setTime(time => {
                    const {totalTime, timeInQueue} = time
                    let timeQ = props.mode ? timeInQueue + 1 : timeInQueue

                    return {
                        ...time, 
                        totalTime: totalTime + 1,
                        timeInQueue: timeQ
                    }
                })

                let tempTimer = timer.slice(0);
                if (tempTimer[2] < 60) tempTimer[2]++;
                else {
                    if (tempTimer[1] < 60) {
                        tempTimer[1]++;
                        tempTimer[2] = 0;
                    }
                    else {
                        if (tempTimer[0] < 60) {
                            tempTimer[0]++;
                            tempTimer[1] = 0;
                            tempTimer[2] = 0;
                        }
                    }
                }
                setTimer(tempTimer);
            }, 1000)
        }
    }, [timer, props.sessionStat])

    return (
        <header>
            <div className='header_left'>
                <h1>CryoEM Training Tool</h1>
                <i className='fa fa-info-circle itip'>
                    <span>The CryoEM Training Tool is prototype meant to train users on identifying good sample selections.</span>
                </i>
            </div>
            <div className='header_right'>
                <div className='header_timer'>{totalSelected} Collected</div>
                <div className='header_timer'>{`${timer[0]} : ${timer[1] > 9 ? timer[1] : '0' + timer[1]} : ${timer[2] > 9 ? timer[2] : '0' + timer[2]}`}</div>
                <button key='header_score' disabled={!sessionStat} className='sqre_btn secondary' id='header_score' onClick={() => {
                    props.setSessionStat(false);
                    props.setActiveDlg(1)
                }}>
                    <span>End Session</span>
                    <i className='fa fa-sign-out'></i>
                </button>

            </div>
        </header>
    )

}