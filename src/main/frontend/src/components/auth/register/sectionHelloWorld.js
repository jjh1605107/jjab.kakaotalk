import {Component} from "react";
import "../../../css/auth/register/sectionHelloWorld.css"

class SectionHelloWorld extends Component{
    constructor(props) {
        super(props);
        this.state={
            currentDateTime: new Date()
        }
    }
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 1을 더하고, 두 자리로 맞추기 위해 padStart 사용
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    render(){
        const { currentDateTime } = this.state;
        const formattedDateTime = this.formatDate(currentDateTime);
        if(this.props.email === null){
            this.props.renderBackup()
        }else{
            return(
                <div id="section-helloworld">
                    <div className="cont_sign">
                        <h2 className="tit_done">환영합니다!</h2>
                        <div className="desc_g">
                            <p>짭카오계정 가입이 완료되었습니다.</p>
                            <p>가입한 이메일에 인증메일을 보냈습니다.</p>
                        </div>
                        <div className="wrap_profile">
                            <span className="photo_profile">
                                 <img src={process.env.PUBLIC_URL + '/image/default_profile_img.png'} alt=""/>
                            </span>
                            <button className="change_photo_profile">
                                <span><img width="20" height="20" src="https://img.icons8.com/ios-glyphs/30/camera--v1.png" alt="camera--v1"/></span>
                            </button>
                        </div>
                        <strong className="tit_profile">{this.props.email}</strong>
                        <span className="txt_profile">{this.props.name}</span>
                        <div className="confirm_btn">
                            <p className="desc_reception">{formattedDateTime}</p>
                            <p className="desc_reception">짭카오알림 채널에서 보내는 광고메시지 수신 동의가 처리되었습니다.(그없)</p>
                            <button className="btn_start" onClick={this.goIntro}>시작하기</button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    goIntro() {
        window.location.href="/"
    }
}

export default SectionHelloWorld