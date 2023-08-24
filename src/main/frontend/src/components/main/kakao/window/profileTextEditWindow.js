import {Component} from "react";

class ProfileTextEditWindow extends Component{
    constructor(props) {
        super(props);
        this.state={
            edit_profile_text:'',
            edit_profile_text_length:0
        }
    }
    profileTextEditHandleChange = (event) => {
        this.setState({
            edit_profile_text: event.target.value,
            edit_profile_text_length:event.target.value.length
        });
    };
    profileTextEditSubmitEnter=(e)=>{
        if (e.key === "Enter") {
            this.profileTextEditSubmit()
        }
    }
    profileTextEditSubmit=()=>{
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('profileText', this.state.edit_profile_text);
        xhr.open('PATCH', '/user/patchProfile');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status >= 200 && xhr.status <300) {
                    const responseObj = JSON.parse(xhr.responseText);
                    switch (responseObj.result){
                        case 'false':
                            alert("세션이 만료 되었습니다.(텍스트 에디트 창)");
                            window.location.href='/';
                            break;
                        case 'null':
                            alert("세션이 만료 되었습니다.(텍스트 에디트 창)");
                            window.location.href='/';
                            break;
                        case 'success':
                            this.props.textEdit();
                            break;
                        default:
                            break;
                    }
                }
            }
        };
        xhr.send(formData);
    }

    render() {
        return(
            <div className="profile_text_edit_on on">
                <h4>상태메시지 올리기</h4>
                <div className="profile_text_edit_input_box">
                    <input type="text" maxLength="10" onChange={this.profileTextEditHandleChange} onKeyDown={this.profileTextEditSubmitEnter}/>
                    <p>{this.state.edit_profile_text_length}/10</p>
                </div>
                <div className="border_container"></div>
                <button onClick={this.profileTextEditSubmit}>확인</button>
            </div>
        )
    }
}

export default ProfileTextEditWindow