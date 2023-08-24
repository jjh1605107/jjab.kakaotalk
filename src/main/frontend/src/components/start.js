import { Component } from 'react';
import Login from './auth/login'
import Register from './auth/register'
import ChattingRoom from './main/chattingRoom'
import { BrowserRouter,Routes,Route} from 'react-router-dom';

class Start extends Component{
    constructor(props) {
        super(props);
        this.state={
            isLoggedIn:false,
            warning_server:''
        };
    }
    componentDidMount() {
        this.checkJwtTokenInCookie()
    }
    checkJwtTokenInCookie = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/user/loginCheck');
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE){
             if (xhr.status >= 200 && xhr.status <300) {
                const responseObj = JSON.parse(xhr.responseText);
                switch (responseObj.result){
                    case 'false':
                        this.setState({
                            isLoggedIn: false
                        });
                        break;
                    case 'true':
                        this.setState({
                            isLoggedIn: true
                        });
                        break;
                    case 'null':
                        this.setState({
                            isLoggedIn: false
                        });
                        break;
                }
             }else{
                 this.setState({
                     warning_server:'서버에 응답이 없습니다'
                 })
             }
           }
         };
         xhr.send();
    }
    onRegister=()=>{
        window.location.href = '/register';
    }
    loginHandler=()=>{
        this.setState({
            isLoggedIn:true
        })
    }
    render() {
        const{isLoggedIn} = this.state;
        if(isLoggedIn===false){
            return(
                <div>
                    <span id="server_warning">{this.state.warning_server}</span>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/'         element={<Login onRegister={this.onRegister} loginHandler={this.loginHandler}/>}/>
                            <Route path='/register' element={<Register/>}/>
                        </Routes>
                    </BrowserRouter>
                </div>
            )
        }
        if(isLoggedIn===true){
            return(
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<ChattingRoom />}/>
                    </Routes>
                </BrowserRouter>
            )
        }
    }
}

export default Start