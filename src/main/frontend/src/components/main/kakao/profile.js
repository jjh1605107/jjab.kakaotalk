import React, {Component} from "react";
import "../../../css/main/kakao/profile.js.css"
import ProfileWindow from "./window/profileWindow"
import SearchFriendWindow from "./window/searchFriendWindow";
import ProfileTextEditWindow from "./window/profileTextEditWindow";
import FriendProfileWindow from "./window/frinedProfileWindow"
class Profile extends Component{
    constructor(props) {
        super(props);
        this.state={
            cover:'',
            profile_text:'',
            profile_nickname:'',
            profile_img:'',
            profile_background_img:'',
            profile_on:'',
            friend_profile_on:false,
            friend_profile_contact:'',
            button:'',
            warning_title:'주요기능',
            warning_info:'사진과 아이콘을 클릭해 보세요!',
            warning_search:'',
            friends:0,
            loading:false,
            friendList:[],
        }
    }
    componentDidMount() {
        this.getProfile();
        this.getFriendList();
    }
    onProfileTextEdit=()=>{
        this.setState({
            cover:'cover',
            edit_profile_text_on:'on'
        })
    }
    AddContactEdit=()=>{
        this.setState({
            cover:'cover',
            edit_contact_add_on:'on',
            loading2:false,
            search_result:''
        })
    }
    onFriendProfileWindow=(e1, e2)=>{
        this.setState({
            cover:'cover',
            friend_profile_on:true,
            friend_profile_contact:e1,
            friend_profile_nickname:e2
        })
    }
    onProfileWindow=()=>{
        this.setState({
            cover:'cover',
            profile_on:'on'
        })
    }
    exitCover=()=>{
        this.setState({
            cover:'',
            edit_profile_text_on:'',
            edit_contact_add_on:'',
            profile_on:'',
            friend_profile_on:false
        })
    }
    textEdit=()=>{
        this.getProfile()
        this.setState({
            cover:'',
            edit_profile_text_on:'',
        })
    }
    textEdit2=()=>{
        this.getFriendList();
    }
    getProfile=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/user/getProfile');
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE){
             if (xhr.status >= 200 && xhr.status <300) {
                const responseObj = JSON.parse(xhr.responseText);
                switch (responseObj.result){
                    case 'false':
                        alert("다시 로그인 해주세요")
                        window.location.href='/'
                        break;
                    case 'null':
                        alert("다시 로그인 해주세요")
                        window.location.href='/'
                        break;
                    default:
                        this.setState({
                            contact:responseObj.profileContact,
                            profile_text:responseObj.profileText,
                            profile_nickname:responseObj.nickname,
                            profile_img:responseObj.profileMainImg,
                            profile_background_img: responseObj.profileBackgroundImg,
                            loading:true
                        })
                        break;
                }
             }
           }
         };
         xhr.send();
    }
    getFriendList=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/user/getFriendList');
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE){
             if (xhr.status >= 200 && xhr.status <300) {
                 const responseObj = JSON.parse(xhr.responseText);
                 const friendDataArray = [];
                 for (let i = 0; i < responseObj.result.length; i++) {
                     const friendData = {
                         profile_text: responseObj.result[i].profileText,
                         profile_nickname: responseObj.result[i].profileNickname,
                         profile_img:responseObj.result[i].profileMainImg,
                         profile_background_img:responseObj.result[i].profileBackgroundImg,
                         profile_contact:responseObj.result[i].contact,
                     };
                     friendDataArray.push(friendData);
                 }
                 this.setState({
                     friendList: friendDataArray,
                     friends:friendDataArray.length
                 });
             }
           }
         };
         xhr.send();
    }
    render() {
        const{friendList, loading}=this.state;
        if(loading===false){
            return(
                <div className="loading-container-profile">
                    <div className="loading-container">
                        <div className="loading-animation"></div>
                    </div>
                </div>
            )
        }
        if(loading === true){
            return(
                <div id="profile_container">
                    <div className={this.state.cover} onClick={this.exitCover}></div>
                    <div className="header">
                        <span>친구</span>
                        <div className="add_contact" onClick={this.AddContactEdit}>

                        </div>
                    </div>

                    <div className="profile_content">
                        <div className="ad_box">
                            <div className="ad_banner"></div>
                        </div>

                        <div className="warning_box hover">
                            <div className="warning_banner">
                                <p>{this.state.warning_title}</p>
                                <p>{this.state.warning_info}</p>
                            </div>
                        </div>
                        <div className="profile_box hover">
                            <div className="profile_state" onClick={this.onProfileWindow}>
                                <p className="profile_img">
                                    {loading && (
                                        <picture>
                                            <img
                                                src={this.state.profile_img}
                                                loading="lazy" alt=""/>
                                        </picture>
                                        )}
                                </p>
                                <div className="profile_info">
                                    <p className="nickname">{this.state.profile_nickname}</p>
                                    <p className="profile_text">{this.state.profile_text}</p>
                                </div>
                            </div>
                            <div className="profile_text_edit" onClick={this.onProfileTextEdit}>
                                상태메시지 수정
                            </div>
                        </div>

                        <div className="border_container"></div>

                        <div className="profile_center">
                            <p className="profile_center_header">친구{this.state.friends}</p>
                            <div className="friend_profile_list">

                                {friendList.map((data, index)=>(
                                    <div key={index} className="friend_profile_box hover" onClick={()=>this.onFriendProfileWindow(data.profile_contact, data.profile_nickname)}>
                                        <div className="friend_profile_state ">
                                            <p className="friend_profile_img">
                                                <picture>
                                                    <img src={process.env.PUBLIC_URL + '/image/default_profile_img.png'} alt=""/>
                                                </picture>
                                            </p>
                                            <div className="friend_profile_info">
                                                <p className="friend_nickname">{data.profile_nickname}</p>
                                                <p className="friend_profile_text">{data.profile_text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`profile_text_edit_on ${this.state.edit_profile_text_on}`}>
                        <ProfileTextEditWindow textEdit={this.textEdit}/>
                    </div>

                    <div className={`profile_on ${this.state.profile_on}`}>
                        <ProfileWindow getProfile={this.getProfile}
                                       exitCover={this.exitCover}/>
                    </div>

                    <div className={`add_contact_on ${this.state.edit_contact_add_on}`}>
                        <SearchFriendWindow getFriendList={this.getFriendList}/>
                    </div>

                    {this.state.friend_profile_on && (
                        <div className={`friend_profile_on ${this.state.friend_profile_on}`}>
                            <FriendProfileWindow contact={this.state.friend_profile_contact}
                                                 contactMine={this.state.contact}
                                                 nickname={this.state.friend_profile_nickname}
                                                 textEdit2={this.textEdit2}
                                                 exitCover={this.exitCover}/>
                        </div>
                    )}

                </div>
            )
        }
    }
}


export default Profile