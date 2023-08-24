import '../../../css/auth/register/sectionRegister.css'
import {Component} from "react";
class SectionEmail extends Component{
    constructor(props) {
        super(props);
        this.state={
            email:'',
            warningClassOne:'',
            warningClassTwo:'',
            warningClassThree:'',
            warningEmail:'',
            clearButton:'',
            warningClassFour:''
        }
    }
    getEmail=(e)=>{
        this.setState({
            warningEmail:'',
            warningClassOne:'',
            warningClassTwo:'',
            warningClassThree:'',
            clearButton:'',
            email:e.target.value
        })
    }
    getBtn1=()=>{
        this.props.inputEamil(this.state.email);
        this.props.increaseLevel();
    }
    componentDidMount() {
        const emailId = window.document.querySelector('.email_id')
        emailId.addEventListener('keydown', (e)=>{
            if(e.keyCode === 13){
                this.setState({
                    warningClassOne:'',
                    warningClassTwo:'',
                    warningClassThree:'',
                    warningClassFour:''
                })
                if(this.state.email === ''){
                    this.setState({
                        warningEmail:'warning',
                        warningClassOne:'warning'
                    })
                    emailId.focus();
                    return
                }
                if(!new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_\\.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(this.state.email)) {
                    this.setState({
                        warningEmail:'warning',
                        warningClassTwo:'warning'
                    })
                    emailId.focus();
                    return
                }

                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                xhr.open('GET', `https://jjab.jjh1605107.co.kr/user/emailCount?email=${this.state.email}`);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE){
                        if (xhr.status >= 200 && xhr.status <300) {
                            const response = JSON.parse(xhr.response);
                            switch (response.result){
                                case "duplicate":
                                    this.setState({
                                        warningEmail : 'warning',
                                        warningClassThree : 'warning'
                                    })
                                    emailId.focus();
                                    break;
                                case "okay":
                                    this.setState({
                                        clearButton:'clear'
                                    })
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            this.setState({
                                warningClassFour:'warning'
                            })
                        }
                    }
                };
                xhr.send();
            }
        })
    }
    render(){
        return(
            <div id="section-register">
                <div className="cont_sign">
                    <div className="tit_g">
                        <h2>짭카오계정으로 사용할</h2>
                        <h2>짭카오메일을 만들어 주세요.</h2>
                    </div>
                    <div className={`box_tf ${this.state.warningEmail}`}>
                        <input name="email"type="text" className="email_id " placeholder="아이디 입력" onChange={this.getEmail}/>
                        <span className="text_email">Enter</span>
                    </div>

                    <p className={`info_tf ${this.state.warningClassOne}`}>아이디를 입력해 주세요.</p>
                    <p className={`info_tf ${this.state.warningClassTwo}`}>올바른 이메일을 입력해 주세요.</p>
                    <p className={`info_tf ${this.state.warningClassThree}`}>이미 존재하는 이메일 입니다.</p>
                    <p className={`info_tf ${this.state.warningClassFour}`}>서버에 문제가 발생하였습니다.</p>

                    <ul className="list_notice">
                        <li>. 입력한 짭카오메일로 짭카오계정에 로그인할 수 있습니다.</li>
                        <li>. 한번 만든 짭카오메일은 변경할 수 없으니, 오타가 없도록 신중히 확인해 주세요</li>
                        <li>. 생성한 짭카오메일로 카카오계정과 관련한 알림을 받아볼 수 있습니다.</li>
                    </ul>
                    <div className="confirm_btn">
                        <button className={`btn_g ${this.state.clearButton}`} onClick={this.getBtn1}>다음</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SectionEmail;