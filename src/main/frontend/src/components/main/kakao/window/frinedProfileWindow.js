import React, {Component} from "react";

class FriendProfileWindow extends Component{
    constructor(props) {
        super(props);
        this.state={
            friend_contact:props.contact,
            profile_nickname:props.nickname,
            profile_text:'',
            profile_img:'',
            profile_background_img:'',
            zoom_image_on:'',
            profile_edit_on:'',
            profile_edit_nickname:'',
            profile_edit_text:'',
            loading:false
        }
    }
    componentDidMount=()=> {
        if(this.state.friend_contact !== ''){
            this.getProfile()
        }
    }
    getProfile=()=>{
        this.setState({
            loading:false
        })
        if(this.state.profile_text !== '' &&
            this.state.profile_nickname !== '' &&
            this.state.profile_img !== '' &&
            this.state.profile_background_img !== ''){
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/user/getProfile?contact=${this.state.friend_contact}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status >= 200 && xhr.status <300) {
                    const responseObj = JSON.parse(xhr.responseText);
                    switch (responseObj.result){
                        case 'false':
                            alert("세션이 만료 되었습니다.(프로필 창)");
                            window.location.href='/';
                            break;
                        case 'null':
                            alert("세션이 만료 되었습니다.(프로필 창)");
                            window.location.href='/';
                            break;
                        default:
                            this.setState({
                                profile_text:responseObj.profileText,
                                profile_img:`data:image/*;base64,${responseObj.profileMainImg}`,
                                profile_background_img: `data:image/*;base64,${responseObj.profileBackgroundImg}`,
                                loading:true
                            })
                            this.props.nickname === '' ? this.setState({profile_nickname:responseObj.nickname})
                                                               : this.setState({profile_real_nickname:responseObj.nickname})
                            break;
                    }
                }
            }
        };
        xhr.send();
    }
    toggleFriendStatus=()=>{
        if(this.props.contactMine === '01011112222'){
            alert("공용 계정은 사용할 수 없습니다")
            return;
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('contactFriend', this.state.friend_contact);
        xhr.open('PATCH', `/user/toggleFriendStatus`)
        xhr.onreadystatechange=()=>{
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status >= 200 && xhr.status < 300){
                    const responseObj = JSON.parse(xhr.responseText);
                    switch (responseObj.result){
                        case 'false':
                            alert("세션이 만료 되었습니다.(프로필 창)");
                            window.location.href='/';
                            break;
                        case 'null':
                            alert("세션이 만료 되었습니다.(프로필 창)");
                            window.location.href='/';
                            break;
                        case 'failure':
                            alert("해당 요청을 처리할 수 없습니다");
                            break;
                        case 'success':
                            this.props.textEdit2()
                            this.props.exitCover()
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        xhr.send(formData);
    }
    editProfileState=()=>{
        this.setState({
            profile_edit_on:'on',
            profile_edit_nickname:this.state.profile_nickname,
            profile_edit_text:this.state.profile_text
        })
    }
    editProfileImage = () => {
        this.setState({
            zoom_image_on:'on'
        })
    }
    exitProfileEdit=()=>{
        this.setState({
            profile_edit_on:''
        })
    }
    exitZoomImage=()=>{
        this.setState({
            zoom_image_on:''
        })
    }
    createRoom=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/chat/createRoom?contactFriend=${this.state.friend_contact}`);
        xhr.onreadystatechange=()=> {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.state >= 200 && xhr.state < 300){
                    const responseObj = JSON.parse(xhr.responseText)

                    alert(responseObj.result);

                    switch (responseObj.result){
                        case 'false':
                            alert("세션이 만료 되었습니다.(방만들기 창)");
                            window.location.href='/';
                            break;
                        case 'null':
                            alert("세션이 만료 되었습니다.(방만들기 에디트 창)");
                            window.location.href='/';
                            break;
                        case 'success':
                            this.props.exitCover();
                            break;
                        case 'failure':
                            alert("오류")
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        xhr.send();
    }
    profileNickNameEditSubmit=()=>{
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('userFriendNameEdit', this.state.profile_edit_nickname)
        formData.append('contactFriend', this.state.friend_contact)
        xhr.open('PATCH', '/user/patchFriendNickname')
        xhr.onreadystatechange=()=>{
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseObj = JSON.parse(xhr.responseText);
                    switch (responseObj.result){
                        case 'false':
                            alert("세션이 만료 되었습니다.(프로필 창)");
                            window.location.href='/';
                            break;
                        case 'null':
                            alert("세션이 만료 되었습니다.(프로필 창)");
                            window.location.href='/';
                            break;
                        case 'success':
                            this.setState({
                                profile_edit_on:'',
                            })
                            this.state.profile_edit_nickname === '' ? this.setState({profile_nickname:this.state.profile_real_nickname}) : this.setState({profile_nickname:this.state.profile_edit_nickname})
                            this.props.textEdit2()
                            break;
                        case 'false':
                            this.setState({
                                warning_edit:'알 수 없는 이유로 실패 하였습니다'
                            })
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        xhr.send(formData);
    }
    render() {
        const {loading} = this.state;
        if(loading===false){
            return(
                <div className="loading-container">
                    <div className="loading-animation"></div>
                </div>
            )
        }
        if (loading===true){
            return(
                <div className={`profile_window`}>
                    {loading && this.state.profile_background_img !== 'data:image/*;base64,'?(
                        <img className="profile_background_img" src={this.state.profile_background_img} alt=""/>
                    ):(
                        <img className="profile_background_img" src={process.env.PUBLIC_URL + '/img/main/kakao/default_background_img.jpg'} alt=""/>
                    )}
                    {loading && (
                        <div className={`profile_header`}>

                        </div>
                    )}
                    {loading &&(
                        <div className="profile_center">
                            <div className="profile_info">
                                {this.state.profile_img !== 'data:image/*;base64,' ?(
                                    <img src={this.state.profile_img} onClick={this.editProfileImage} alt=""/>
                                ):(
                                    <img src={process.env.PUBLIC_URL + '/img/main/kakao/default_profile_img.png'} alt=""/>
                                )}
                                <p className={`profile_nickname`}>{this.state.profile_nickname}</p>
                                <p className={`profile_text`}>{this.state.profile_text}</p>
                            </div>
                        </div>
                    )}

                    {loading &&(
                        <div className="profile_footer">
                            <div className="item" onClick={this.createRoom}>
                                채팅하기
                            </div>
                            <div className="item" onClick={this.editProfileState}>
                                편집
                            </div>
                            <div className="item" onClick={this.toggleFriendStatus}>
                                차단
                            </div>
                        </div>
                    )}

                    {loading &&(
                        <div className={`profile_image_zoom ${this.state.zoom_image_on}`}>
                            <div onClick={this.exitZoomImage}></div>
                            <img src={this.state.profile_img}/>
                        </div>
                    )}

                    {loading &&(
                        <div className={`profile_edit ${this.state.profile_edit_on}`}>
                            <h4>친구 닉네임 편집</h4>
                            <div onClick={this.exitProfileEdit}></div>

                            <img src={this.state.profile_img}/>
                            <input type="file" id="image_input" accept="image/*"/>

                            <div className="progress-bar">
                                <div className="progress"></div>
                            </div>

                            <div className="edit_nickname_form">
                                <input type="text" maxLength="8" placeholder={this.state.profile_real_nickname} defaultValue={this.state.profile_nickname} onChange={(e)=>{this.setState({profile_edit_nickname:e.target.value})}}/>
                            </div>

                            <span>{this.state.warning_edit}</span>
                            <div className="edit_button_form">
                                <button onClick={this.profileNickNameEditSubmit}>확인</button>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default FriendProfileWindow