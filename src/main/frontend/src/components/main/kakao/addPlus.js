import {Component} from "react";

class addPlus extends Component{
    logout=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/user/logout');
        xhr.onreadystatechange=()=>{
            if (xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status >= 200 && xhr.status <300) {
                    localStorage.removeItem("usernameskakaoautoid");
                    localStorage.removeItem("usernameskakaoautopw");
                    window.location.href='/'
                }
            }
        }
        xhr.send();
    }
    render(){
        return(
            <div>
                <div className="header">
                    <span>로그아웃</span>
                </div>
                <div className="add_content">
                    <span onClick={this.logout}>로그아웃</span>
                </div>
            </div>
        )
    }
}
export default addPlus