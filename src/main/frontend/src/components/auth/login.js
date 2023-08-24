import '../../css/auth/login.css'
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMinus, faX, faCog, faQrcode, faExclamation, faCaretUp, faCaretDown} from '@fortawesome/free-solid-svg-icons';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked : '',
            email:'',
            password:'',
            login:'',
            toggleLoginList:'on',
            loginList:JSON.parse(localStorage.getItem("usernameskakao")) || [],
            saveList:''
        }
    };
    componentDidMount() {
        this.autoLogin();
    }
    autoLogin=()=>{
        let autoId = localStorage.getItem("usernameskakaoautoid");
        let autoPw = localStorage.getItem("usernameskakaoautopw");
        if(autoId !== null && autoPw !== null){
            this.setState({
                email:autoId,
                password:autoPw
            },
                ()=>{
                this.submitLogin();
                }
            )
        }
    }
    checkHandler = () =>{
        this.setState((e)=>({
            isChecked:!e.isChecked
        }))
    }
    getEmail = (e) => {
        e.preventDefault();
        this.setState({ email:e.target.value }, this.getIdPassword);
    }
    getPassword = (e) => {
        e.preventDefault();
        this.setState({ password:e.target.value }, this.getIdPassword);
    }
    getIdPassword = () => {
        const { email, password } = this.state;
        const login = (email.length >= 10 && password.length >= 6) ? 'on' : '';
        this.setState({ login });
    }
    loginList=()=>{
        this.state.toggleLoginList===''? this.setState({toggleLoginList:'on'}):this.setState({toggleLoginList:''})
    }
    submitLogin=()=> {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('email', this.state.email);
        formData.append('password', this.state.password);
        xhr.open('POST', '/user/login');
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE){
             if (xhr.status >= 200 && xhr.status <300) {
                 const response = JSON.parse(xhr.response);
                 switch (response.result){
                     case 'true':
                         break;
                     case 'failure':
                         //아이디 또는 비밀번호가 틀립니다
                         this.setState({
                             warning:'아이디 또는 비밀번호가 틀립니다.'
                         })
                         break;
                     case 'failure_email_not_verified':
                         //이메일 인증 안된 이메일
                         this.setState({
                             warning:'이메일 인증을 완료해 주세요'
                         })
                         break;
                     case 'success':
                         const response = JSON.parse(xhr.responseText);
                         const token = response.token;
                         window.document.cookie = `jwtToken=${token}; path=/;`;
                         if(this.state.isChecked){
                             localStorage.setItem("usernameskakaoautoid", this.state.email)
                             localStorage.setItem("usernameskakaoautopw", this.state.password)
                         }
                         var storedUsernames = localStorage.getItem("usernameskakao");
                         storedUsernames = storedUsernames ? JSON.parse(storedUsernames) : [];
                         if (!storedUsernames.includes(this.state.email)) {
                             storedUsernames.push(this.state.email);
                             localStorage.setItem("usernameskakao", JSON.stringify(storedUsernames));
                         }
                         this.props.loginHandler();
                         window.location.href="/"
                         break;
                     default:
                         break;
                 }
             } else {
                 this.setState({
                     warning:'서버에 응답이 없습니다.'
                 })
             }
           }
         };
         xhr.send(formData);
    }
    submitPublicLogin=()=>{
        this.setState({
                email:'hello123@gmail.com',
                password:'abcd1234!'
            },
            ()=>{
                this.submitLogin();
            })
    }
    render(){
        const {isChecked} = this.state;
        return(
            <body>
            <div id="main_container">
                <div className="header_container">
                    <FontAwesomeIcon icon={faCog} />
                    <span>|</span>
                    <FontAwesomeIcon icon={faMinus} />
                    <FontAwesomeIcon icon={faX} />
                </div>
                <div className="logo_container">
                    <div></div>
                </div>

                <div className="center_container">

                    <div className="save_login">
                        <input type="text" placeholder="아이디" maxLength={32} defaultValue={this.state.saveList} onChange={this.getEmail}/>
                        <div className="faCaret" onClick={this.loginList}>
                            <FontAwesomeIcon icon={faCaretUp} className={ this.state.toggleLoginList}/>
                            <FontAwesomeIcon icon={faCaretDown} className={ this.state.toggleLoginList}/>
                        </div>

                        <div className={`save_list ${this.state.toggleLoginList}`} >
                            {this.state.loginList.map((username, index) => (
                                <span key={index} onClick={()=>{this.setState({saveList:username,email:username,toggleLoginList:'on'})}}>{username}</span>
                            ))}
                        </div>
                    </div>

                    <input className="password" type="password" placeholder="비밀번호" maxLength={32} onChange={this.getPassword}/>
                    <span className="warning_state">{this.state.warning}</span>
                    <input className={`login_button ${this.state.login}`} onClick={this.submitLogin} type="button" value="로그인"/>
                    <div className="line">
                        <div/><span>또는</span><div/>
                    </div>
                    <button className="qr_button" onClick={this.submitPublicLogin}>
                        <span><FontAwesomeIcon icon={faQrcode} className="faQr" />공용 계정 로그인</span>
                    </button>

                    <div className="check_login" onClick={this.checkHandler}>
                        <input type="checkbox" checked={isChecked}/>
                        <span>자동로그인</span>
                        <div className="checkbox_img">
                            <FontAwesomeIcon icon={faExclamation} rotation={180}/>
                        </div>
                    </div>

                </div>

                <div className="footer_container">
                        <span onClick={this.props.onRegister}>짭카오톡 회원가입</span>
                        <span>|</span>
                        <a href="https://jjab.jjh1605107.co.kr/recover">아이디/비밀번호 찾기</a>
                </div>
            </div>
            </body>
        )
    }
}

export default Login;