

function Error(props){
    return(
        <div>
            <div className="cover"></div>
            <div className="inner_layer">
                <p>잘못된 요청입니다.</p>
                <div className="layer_foot">
                    <button onClick={props.increaseLevel} className="btn_g">
                        확인
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Error;