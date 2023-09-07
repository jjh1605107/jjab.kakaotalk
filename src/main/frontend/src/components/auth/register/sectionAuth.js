import '../../../css/auth/register/sectionAuth.css';
import {Component} from "react";

class SectionAuth extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cover:'',
            clear: '',
            contact: '',
            on1: 'on',
            on2: '',
            on3: '',
            code: '',
            request: '요청',
            time: 300
        };
    }
    timer = () => {
        const time = setInterval(() => {
            let result = this.state.time - 1;
            this.setState({ time: result });
            if (result === 0) {
                clearInterval(time);
            }
        }, 1000);
    }

    formatTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if(seconds <= 9){
            seconds = `${0}${seconds}`
        }
        return `${minutes}:${seconds}`;
    }
    registerResponse=(e)=>{
        window.document.querySelector('.warning').innerText = '';
        this.setState({
            on3:'',
        })
        if (!/^010\d{8}$/.test(this.state.contact)) {
            window.document.querySelector('.warning').innerText = '올바른 번호를 입력해주세요';
            this.setState({
                on3:'on'
            })
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/user/contactCode?contact=${this.state.contact}`);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE){
             if (xhr.status >= 200 && xhr.status <300) {
                const response = JSON.parse(xhr.response);
                switch (response.result){
                    case 'failure':
                        window.document.querySelector('.warning').innerText = '올바른 방법으로 접근 하세요.';
                        this.setState({
                            on3:'on'
                        })
                        break;
                    case 'failure_duplicate':
                        window.document.querySelector('.warning').innerText = '이미 사용중인 번호 입니다.';
                        this.setState({
                            on3:'on'
                        })
                        break;
                    case 'success':
                        window.document.querySelector('.warning').innerText = '5분내로 문자로 전송된 인증번호를 입력해주세요.';
                        this.timer()
                        this.setState({
                            on2:"on",
                            on3:"on",
                            request:"다시",
                            clear:'clear',
                            salt:response.salt
                        })
                        break;
                }
             } else {

             }
           }
         };
         xhr.send();
    }
    registerRequest=(e)=>{
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('salt', this.state.salt);
        formData.append('code', this.state.code);
        formData.append('contact', this.state.contact);
        xhr.open('PATCH', '/user/contactCode');
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE){
             if (xhr.status >= 200 && xhr.status <300) {
                 const response = JSON.parse(xhr.response)
                switch (response.result){
                    case 'failure':
                        window.document.querySelector('.warning').innerText = '잘못된 인증번호 입니다.';
                        this.setState({
                            on3:'on'
                        })
                        break;
                    case 'failure_expired':
                        window.document.querySelector('.warning').innerText = '인증유효 시간을 초과 하였습니다.';
                        this.setState({
                            on3:'on'
                        })
                        break;
                    case 'success':
                        window.document.querySelector('.warning').innerText = '인증이 완료되었습니다.';
                        this.setState({
                            on3:'on',
                            clear:'clear',
                            time:1
                        })
                        break;
                }
             } else {
                 window.document.querySelector('.warning').innerText = '서버에 오류가 발생하였습니다.';
                 this.setState({
                     on3:'on'
                 })
             }
           }
         };
         xhr.send(formData);
    }
    getContact=(e)=>{
        e.preventDefault();
        this.setState({
            contact:e.target.value
        })
    }
    getContactCode=(e)=>{
        e.preventDefault();
        this.setState({
            code:e.target.value
        })
    }
    submitBtn=()=>{
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('email', this.props.email);
        formData.append('contact', this.state.contact);
        formData.append('password', this.props.password);
        formData.append('name', this.props.name);
        formData.append('birthdate', this.props.birthdate);
        formData.append('lunar', this.props.lunar);
        formData.append('salt', this.state.salt);
        formData.append('code', this.state.code);
        xhr.onloadstart = ()=> {
            this.setState({
                cover: 'cover'
            })
        }
        xhr.onload=()=>{
            this.setState({
                cover:''
            })
        }
        xhr.open('POST', '/user/register');
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE){
             if (xhr.status >= 200 && xhr.status <300) {
                 const response = JSON.parse(xhr.response);
                 switch(response.result){
                     case 'success':
                         this.props.increaseLevel();
                         break;
                     case 'failure':
                         break;
                 }
             } else {
                 window.document.querySelector('.warning').innerText = '알 수 없는 오류가 발생하였습니다.';
                 this.setState({
                     on3:'on'
                 })
             }
           }else{
              window.document.querySelector('.warning').innerText = `서버에 오류가 발생하였습니다. `;
              this.setState({
                  on3:'on'
              })
          }
         }
         xhr.send(formData);
    }
    render(){
        if(this.props.getEmail === ''){
            this.props.renderBackup();
        }else{
            return(
                <div id="section-auth">

                    <div className={this.state.cover}>
                        <span></span>
                    </div>

                    <div id="auth-container">
                        <div>
                            <div className="text">
                                <span>카카오계정 가입을 위해</span>
                                <span>휴대폰 인증을 진행해 주세요.</span>
                            </div>

                            <div className={`item ${this.state.on1}`}>
                                <input type="text" placeholder="전화번호 입력" minLength="10" maxLength="11" onChange={this.getContact}/>
                                <button onClick={this.registerResponse}>{this.state.request}</button>
                            </div>

                            <div className={`item ${this.state.on2}`}>
                                <input type="text" placeholder="인증번호 입력" minLength="10" maxLength="11" onChange={this.getContactCode}/>
                                <span>{this.formatTime(this.state.time)}</span>
                                <button onClick={this.registerRequest}>확인</button>
                            </div>

                            <span className={`warning ${this.state.on3}`}></span>

                            <div className={`next_btn ${this.state.clear}`} onClick={this.submitBtn}>
                                <span>다음</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

    }
}

export default SectionAuth;