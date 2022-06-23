import './styles/App.scss';
import './styles/ibm-plex.min.css';
import HomePage from './components/HomePage';
import Header from './components/Header';
import { Canvas } from './components/Canvas';
import Sidebar from './components/Sidebar';
import Dialog from './components/Dialog';
import NavDialog from './components/NavDialog';

import { useState, useEffect, createRef } from 'react';
import { API_URL } from './config';
import { downloadJSON, postResults } from './utils'

export default function App() {
  const [sessionStat, setSessionStat] = useState(1); //1: homepage, 2: session, false: session inactive
  const [activeDlg, setActiveDlg] = useState(false); //1: congrats, 2: detail, 3: accuracy
  const [navDlg, setNavDlg] = useState(false); //0: atlas 1: grid 2: sqre
  const [footerStat, setFooterStat] = useState(false); //true: expanded, false: collapsed
  const [dataSet, setDataSet] = useState('')
  const [curImg, setCurImg] = useState({ grid: -1, sqre: -1, holeSet: -1 });
  const [totalSelected, setTotalSelected] = useState(0)
  const [mode, setMode] = useState(false)  //false: inspection, true: queueing
  const [selectedImgs, setSelectedImgs] = useState('');
  const [selectedHole, setSelectedHole] = useState('');
  const [dataToExport, setDataToExport] = useState([])
  const [time, setTime] = useState({ totalTime: 0, timeInQueue: 0 })
  const mainImgRef = createRef();

  useEffect(() => {
    function getData() {
      fetch(`${API_URL}/annotation_data`)
        .then(res => res.json())
        .then((data) => {
          setDataSet(data);
          // let imgs = [];
          // imgs.push(Object.keys(data)[0]);
          // imgs.push(Object.keys(data[imgs[0]])[0]);
          // imgs.push(Object.keys(data[imgs[0]][imgs[1]])[0]);
          setCurImg((prevState) => { return { ...prevState, grid: Object.keys(data)[0] } })
        })
        .catch(e => console.log(e));
    };

    getData();
  }, [])

  useEffect(() => {
    // if(activeDlg === 1) downloadJSON(dataToExport) //download gameplay
    if (activeDlg === 1) {
      postResults(dataToExport, time)
    } //post data to server
  }, [activeDlg])

  const updateSelectedImgs = (newList) => {
    let tempList = selectedImgs[curImg.holeSet] ? Object.assign(selectedImgs[curImg.holeSet], newList) : newList;
    setSelectedImgs(prevState => { return { ...prevState, [curImg.holeSet]: tempList } });
  }

  const getCurImgData = () => {
    return dataSet[curImg.grid] && dataSet[curImg.grid][curImg.sqre] && dataSet[curImg.grid][curImg.sqre][curImg.holeSet] ? dataSet[curImg.grid][curImg.sqre][curImg.holeSet] : undefined
  }

  const updateSessionOption = () => {
    setSessionStat(2);
    setNavDlg(0)
  }

  const resetSession = () => {
    setSessionStat(1);
    setFooterStat(false);
    setTotalSelected(0)
    setActiveDlg(false);
    setSelectedImgs({})
    // imgs.push(Object.keys(dataSet)[0]);
    // imgs.push(Object.keys(dataSet[imgs[0]])[0]);
    // imgs.push(Object.keys(dataSet[imgs[0]][imgs[1]])[0]);
    setCurImg((prevState) => { return { ...prevState, grid: Object.keys(dataSet)[0], sqre: -1, holeSet: -1 } })
  }

  const addData = (action_id, image_id, ctf, is_right_answer) => {
    const tempData = {
      target_name: image_id,
      ctf: ctf,
    };
    setDataToExport((prevState) => [...prevState, tempData])
  }

  return (
    <div className='App'>
      {sessionStat === 1 && <HomePage updateSessionOption={updateSessionOption}></HomePage>}
      {sessionStat !== 1 && <div><Header sessionStat={sessionStat} setSessionStat={setSessionStat} setActiveDlg={setActiveDlg} totalSelected={totalSelected} setTime={setTime} mode={mode} setMode={setMode}></Header>
        {dataSet && sessionStat !== 1 &&
          <Sidebar selectedList={selectedImgs} setSelectedHole={setSelectedHole} setActiveDlg={setActiveDlg} mode={mode} setMode={setMode} curImg_holeset={curImg?.holeSet}></Sidebar>}
        {dataSet && sessionStat === 3 &&
          <div>
            <Canvas sessionStat={sessionStat} selectedList={selectedImgs[curImg.holeSet]} updateSelectedImgs={updateSelectedImgs} dataSet_holeSet={getCurImgData()} curImg={curImg} footerStat={footerStat} setTotalSelected={setTotalSelected} ref={mainImgRef} action_id={totalSelected} addData={addData}></Canvas>
            <div className='navBtn-wrppr column'>
              <button className='icon_btn secondary itip' onClick={() => setNavDlg(0)}>
                G
                <span>Change Grid</span>
              </button>
              <button className='icon_btn secondary itip' onClick={() => setNavDlg(1)}>
                S
                <span>Change Square</span>
              </button>
              <button className='icon_btn secondary itip' onClick={() => setNavDlg(2)}>
                P
                <span>Change Patch</span>
              </button>
            </div>
          </div>
        }
        {navDlg !== false && <NavDialog navDlg={navDlg} setNavDlg={setNavDlg} dataSet={dataSet} curImg={curImg} setCurImg={setCurImg} footerStat={footerStat} setFooterStat={setFooterStat} selectedImgs={selectedImgs} sessionStat={sessionStat} setSessionStat={setSessionStat} />}
        {activeDlg && <Dialog activeDlg={activeDlg} setActiveDlg={setActiveDlg} curImg={curImg} dataSet={dataSet} dataSet_holeSet={getCurImgData()} selectedHole={selectedHole} resetSession={resetSession} />}
      </div>}
    </div>
  );
}
