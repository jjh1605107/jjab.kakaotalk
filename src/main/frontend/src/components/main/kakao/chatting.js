import React, {Component} from "react"
import "../../../css/main/kakao/chatting.css"
import Chat from "./chatting/chat"

class Chatting extends Component{
    constructor(props) {
        super(props);
        this.state={
            chatOn:false,
            contact:'',
            roomId:'',
            roomList:[],
        }
    }
    componentDidMount() {
        this.getProfile()
        this.searchRoomId()
    }
    searchRoomId=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/chat/getRoomList');
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE){
             if (xhr.status >= 200 && xhr.status <300) {
                 const responseObj = JSON.parse(xhr.responseText);
                 const roomDataArray = [];
                 for (let i = 0; i < responseObj.result.length; i++) {
                     const roomLastMessage = responseObj.result[i].roomLastMessage;
                     const shortenedLastMessage = roomLastMessage.length <= 10 ? roomLastMessage : roomLastMessage.substring(0, 10) + '...';
                     const roomData = {
                         room_id:responseObj.result[i].roomId,
                         room_name:responseObj.result[i].roomName,
                         room_main_image:`data:image/*;base64,${responseObj.result[i].roomMainImage}`,
                         room_users:responseObj.result[i].roomUsers,
                         room_last_message:shortenedLastMessage,
                         room_last_message_time:responseObj.result[i].roomLastMessageTime
                     };
                     roomDataArray.push(roomData);
                 }
                 this.setState({
                     roomList: roomDataArray,
                 });
             }
           }
         };
         xhr.send();
    }
    chatJoin=(id, name, image)=>{
        this.setState({chatOn: this.state.chatOn ===false? true:false,
                            roomId:id,
                            roomName:name,
                            roomImage:image})
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
                                profile_text:responseObj.profileText,
                                profile_nickname:responseObj.nickname,
                                profile_img:`data:image/*;base64,${responseObj.profileMainImg}`,
                                profile_background_img: `data:image/*;base64,${responseObj.profileBackgroundImg}`,
                                profile_contact:responseObj.profileContact,
                                loading:true
                            })
                            break;
                    }
                }
            }
        };
        xhr.send();
    }
    formattedDate = (e) => {
        if(e===undefined){
            return;
        }
        const date = new Date(e);
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Seoul"
        };
        return new Intl.DateTimeFormat("ko-KR", options).format(date);
    }
    exitEvent=()=>{
        this.setState({chatOn:''})
        this.searchRoomId()
    }
    render() {
        return(
            <div id="chatting_container">
                <div className="header">
                    <span>채팅</span>
                </div>
                <div className="chatting_center">
                    {this.state.roomList.length === 0 ? (
                        <p>채팅을 시작해 보세요!</p>
                    ) : (
                        this.state.roomList.map((data, index) => (
                            <div key={index} className="chatting_box hover" onClick={() => { this.chatJoin(data.room_id, data.room_name, data.room_main_image) }}>
                                <div className="chatting_state">
                                    <p className="chatting_img">
                                        {data.room_main_image !== 'data:image/*;base64,' ?(
                                            <img src={data.room_main_image} loading="lazy" alt="" />
                                        ):(
                                            <img src={process.env.PUBLIC_URL + '/img/main/kakao/default_profile_img.png'} alt=""/>
                                        )}
                                    </p>
                                    <div className="friend_profile_info">
                                        <p className="chatting_title">{data.room_name} <p>{data.room_users}</p></p>
                                        <p className="chatting_last_dialogue">{data.room_last_message}</p>
                                    </div>
                                </div>
                                <div className="chatting_state2">
                                    <div className="chatting_last_time">{this.formattedDate(data.room_last_message_time)}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {this.state.chatOn && (
                    <div className="chatting_box2">
                        <Chat nickName={this.state.profile_nickname}
                              contact={this.state.profile_contact}
                              userImage={this.state.profile_img}
                              roomId={this.state.roomId}
                              roomName={this.state.roomName}
                              roomImage={this.state.roomImage}
                              exit={this.exitEvent}/>
                    </div>
                )}
            </div>
        )
    }
}

export default Chatting