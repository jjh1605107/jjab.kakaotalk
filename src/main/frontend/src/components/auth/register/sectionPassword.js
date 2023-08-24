import '../../../css/auth/register/sectionPassword.css'
import {Component} from "react";

class SectionPassword extends Component{
    constructor(props) {
        super(props);
        this.state={
            getPassword:'',
            checkPassword:'',
            warningPassword:'',
            warningPassword2:'',

            warning1:'',
            warning2:'',

            warning3:'',
            warning4:'',

            buttonClear:''
        }
    }
    getPassword=(e)=>{
        this.setState({
            warning1:'',
            warning2:'',
            warningPassword:'',
            warningPassword2:''
        })
        if(e.target.value===''){
            this.setState({
                warning1:'warning',
                warningPassword:'warning'
            })
            return;
        }
        if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/.test(e.target.value)) {
            this.setState({
                warning2: 'warning',
                warningPassword:'warning'
            });
            return;
        }
        this.setState({
            getPassword:e.target.value
        })
    }

    checkPassword=(e)=>{
        this.setState({
            warning3:'',
            buttonClear:''
        })
        if(this.state.getPassword===''){
            return;
        }
        if(this.state.getPassword !== e.target.value){
            this.setState({
                warning3:'warning',
                warningPassword2:'warning'
            })
            return;
        }
        this.setState({
            checkPassword:e.target.value,
            buttonClear:'clear'
        })
    }
    getBtn2=()=>{
        this.props.inputPassword(this.state.getPassword);
        this.props.increaseLevel()
    }
    render(){
        if(this.props.getEmail === ''){
            this.props.renderBackup();
        }else{
            return(
                <div id="section-password">
                    <div className="cont_signt">
                        <h2 className="tit_gt">
                            <span>짭카오계정 로그인에 사용할</span>
                            <span>비밀번호를 등록해 주세요.</span>
                        </h2>
                        <strong className="tit_tff">짭카오계정</strong>
                        <span className="txt_email"> {this.props.getEmail}</span>
                            <strong className="tit_tff">비밀번호</strong>
                            <div className={`box_tff ${this.state.warningPassword}`} >
                                <input type="password" className="new_password" placeholder="비밀번호 입력(8~32자리)" onBlur={this.getPassword}/>
                            </div>
                            <p className={`info_tff ${this.state.warning1}`}>비밀번호를 입력해 주세요(영문자/숫자/특수문자)</p>
                            <p className={`info_tff ${this.state.warning2}`}>영문자/숫자/특수문자를 모두 조합해 입력해 주세요.</p>
                            <div className={`box_tff ${this.state.warningPassword2}`}>
                                <input type="password" className="new_password_check" placeholder="비밀번호 재입력" onBlur={this.checkPassword} onChange={this.checkPassword}/>
                                <p className={`info_tff ${this.state.warning3}`}>입력한 비밀번호와 재입력한 비밀번호가 일치하지 않습니다.</p>
                            </div>
                            <ul className="list_notice">
                                <li>비밀번호는 8~32자리의 영문 대소문자, 숫자, 특수문자를 조합하여 설정해주세요</li>
                                <li>다른 사이트에서 사용하는 것과 동일하거나 쉬운 비밀번호는 사용하지 마세요</li>
                                <li>안전한 계정 사용을 위해 비밀번호는 주기적으로 변경해 주세요</li>
                            </ul>
                            <div className="confirm_btn">
                                <button className={`btn_g ${this.state.buttonClear}`} onClick={this.getBtn2}>다음</button>
                            </div>
                    </div>
                </div>
            )
        }
    }
}

export default SectionPassword;