export default function HomePage(props) {
    const startSession = () => {
        props.updateSessionOption();
    }
    return (
        <div id='homepage_screen'>
            <h2>Welcome to CryoEM Training Simulator</h2>
            <span>The CryoEM Training Tool is a prototype to train users on identifying good sample selections.</span>
            <button id='startsession' className='sqre_btn primary' onClick={startSession} style={{marginTop: '64px'}}>Start Session</button>
        </div>
    )
}