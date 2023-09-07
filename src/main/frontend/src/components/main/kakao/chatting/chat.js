import {Component} from "react";
import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import FriendProfileWindow from "../window/frinedProfileWindow";
import RoomProfileWindow from "../window/roomProfileWindow";
class Chat extends Component{
    constructor(props) {
        super(props);
        this.state={
            roomId:props.roomId,
            username: props.nickName,
            socket : new SockJS(`https://jjab.jjh1605107.co.kr/chat/${props.roomId}`),
            //socket : new SockJS(`http://localhost:3000/chat/${props.roomId}`),
            messages:[''],
            messageInput:'',
            emoji_box: '',
            cover:'',
            chatting_add_user_on:'',
            chatting_add_window_on:'',
            chatting_user_list_on:'',

            friendList:[],
            userList:[],
            userLength:0,
            timestamp: Date.now(),
            loading:false,
            loading2:false
        };
        this.chatMessagesRef = React.createRef();
    }
    componentDidMount() {

        this.getRoomJoinList()
        this.fetchChatMessages()
        this.stompClient = Stomp.over(this.state.socket);
        this.stompClient.connect({}, this.onConnected, this.onError);
        this.state.socket.onclose=(e)=>{if(!e.wasClean){window.location.href="/"}}
        this.getFriendList()
        this.scrollToBottom()
        this.setState({
            loading:true
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.messages.length !== this.state.messages.length) {
            this.scrollToBottom();
        }
    }
    scrollToBottom = () => {
        if (this.chatMessagesRef.current) {
            this.chatMessagesRef.current.scrollTop = this.chatMessagesRef.current.scrollHeight;
        }
    };
    exitChat=()=>{
        this.stompClient.disconnect(this.onDisconnected)
        this.props.exit()
    }
    onConnected = () => {
        this.stompClient.subscribe(`/topic/public/${this.state.roomId}`, this.onMessageReceived);
        this.stompClient.send(`/app/chat.addUser/${this.state.roomId}`, {}, JSON.stringify({
            sender: this.state.username,
            type: 'JOIN',
            roomId:this.state.roomId,
            content:'JOIN',
            check:this.props.contact,
            unreadCount:this.state.userList.length,}));
    };
    onDisconnected = () => {
        this.stompClient.send(`/app/chat.sendMessage/${this.state.roomId}`, {}, JSON.stringify({
            sender: this.state.username,
            type: 'LEAVE',
            roomId:this.state.roomId,
            content: 'LEAVE',
            check:this.props.contact,
            unreadCount:this.state.userList.length,}));
    };
    sendMessage = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            this.setState((e) => ({
                messageInput:'\n',
            }));
        }
        if (e.key === 'Enter'&& !e.ctrlKey) {
            e.preventDefault()
            if (this.state.messageInput !==''&& this.state.messageInput!=='/n' && this.stompClient) {
                const chatMessage = {
                    sender: this.state.username,
                    content: this.state.messageInput,
                    roomId: this.state.roomId,
                    type: 'CHAT',
                    unreadCount:this.state.userList.length,
                    check:this.props.contact,
                };
                this.stompClient.send(`/app/chat.sendMessage/${this.state.roomId}`, {}, JSON.stringify(chatMessage));
                this.setState({
                    messageInput: '',
                });
            }
        }
    };
    onMessageReceived = (message) => {
        const msg = JSON.parse(message.body);
        if (!this.isDuplicateMessage(msg)) {
            const messages = [...this.state.messages];
            messages.push(msg);
            this.setState({ messages });
        }
    };
    isDuplicateMessage = (msg) => {
        //자바 스크립트 문제로 인해 중복된 메세지 거름 식별값 id
        const existingMessages = this.state.messages;
        for (const existingMsg of existingMessages) {
            if (existingMsg.id === msg.id) {
                return true;
            }
        }
        return false;
    };
    getRoomJoinList=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/chat/getRoomJoinList?roomId=${this.state.roomId}`)
        xhr.onreadystatechange=()=>{
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status >= 200 & xhr.status < 300){
                    const responseObj = JSON.parse(xhr.responseText);
                    const userDataArray=[];
                    for(let i = 0; i < responseObj.result.length; i++){
                        const userData={
                            profile_text: responseObj.result[i].profileText,
                            profile_nickname: responseObj.result[i].profileNickname,
                            profile_img: `data:image/*;base64,${responseObj.result[i].profileMainImg}`,
                            profile_background_img: `data:image/*;base64,${responseObj.result[i].profileBackgroundImg}`,
                            profile_contact:responseObj.result[i].contact
                        };
                        localStorage.setItem(responseObj.result[i].contact, `data:image/*;base64,${responseObj.result[i].profileMainImg}`);
                        userDataArray.push(userData);
                    }
                    var count = responseObj.userCount;
                    this.setState({
                        userList: userDataArray,
                        userLength: count
                    });
                }
            }
        }
        xhr.send();
    }
    getFriendList=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/user/getFriendList');
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
                            const friendDataArray = [];
                            for (let i = 0; i < responseObj.result.length; i++) {
                                const friendData = {
                                    profile_text: responseObj.result[i].profileText,
                                    profile_nickname: responseObj.result[i].profileNickname,
                                    profile_img:`data:image/*;base64,${responseObj.result[i].profileMainImg}`,
                                    profile_background_img:`data:image/*;base64,${responseObj.result[i].profileBackgroundImg}`,
                                    profile_contact:responseObj.result[i].contact
                                };
                                friendDataArray.push(friendData);
                            }
                            this.setState({
                                friendList: friendDataArray,
                                friends: this.state.friendList.length
                            });
                            break;
                    }

                }
            }
        };
        xhr.send();
    }
    fetchChatMessages=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/chat/fetchChatMessages?check=${this.props.contact}&roomId=${this.props.roomId}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status >= 200 && xhr.status <300) {
                    const responseObj = JSON.parse(xhr.responseText);
                    this.setState({loading:false})
                    let index = 0;
                    const processMessage = () => {
                        if (index < responseObj.length) {
                            this.onMessageReceived({ body: JSON.stringify(responseObj[index]) });
                            index++;
                            setTimeout(processMessage, 0);
                        }
                    };
                    processMessage();
                    this.setState({loading:true});
                }
            }
        };
        xhr.send();
    }
    addFriendRoom=(contact, nickname)=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/chat/addFriendRoom?contactFriend=${contact}&roomId=${this.state.roomId}`)
        xhr.onreadystatechange=()=> {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseObj = JSON.parse(xhr.responseText);
                    switch (responseObj.result) {
                        case 'false':
                            alert("다시 로그인 해주세요")
                            window.location.href = '/'
                            break;
                        case 'null':
                            alert("다시 로그인 해주세요")
                            window.location.href = '/'
                            break;
                        case 'duplicate':
                            alert("이미 참가중입니다.")
                            break;
                        case 'success':
                            this.setState({chatting_add_window_on:'', cover:''})
                            this.stompClient.send(`/app/chat.sendMessage/${this.state.roomId}`, {}, JSON.stringify({
                                sender: nickname,
                                type: 'ADD',
                                content: 'ADD',
                                roomId: this.state.roomId,
                                unreadCount:this.state.userList.length+1,
                                check:contact
                            }));
                            break;
                    }
                }
            }
        }
        xhr.send();
    }
    exitRoom=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/chat/exitRoom?contact=${this.props.contact}&roomId=${this.state.roomId}`)
        xhr.onreadystatechange=()=>{
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status  >= 200 && xhr.status  < 300) {
                    const responseObj = JSON.parse(xhr.responseText);
                    switch (responseObj.result) {
                        case 'false':
                            alert("다시 로그인 해주세요")
                            window.location.href = '/'
                            break;
                        case 'null':
                            alert("다시 로그인 해주세요")
                            window.location.href = '/'
                            break;
                        case 'success':
                            this.stompClient.send(`/app/chat.sendMessage/${this.state.roomId}`, {}, JSON.stringify({
                                sender: this.state.username,
                                type: 'EXIT',
                                content: 'EXIT',
                                roomId: this.state.roomId,
                                unreadCount:this.state.userList.length,
                                check:this.props.contact
                            }));
                            this.exitChat()
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        xhr.send();
    }
    formattedDate = (e) => {
        const date = new Date(e);
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Seoul"
        };
        return new Intl.DateTimeFormat("ko-KR", options).format(date);
    }
    onFriendProfileWindow=(e1, e2)=>{
        this.exitCover();
        this.setState({
            cover:'cover',
            friend_profile_on:true,
            friend_profile_contact:e1,
            friend_profile_nickname:e2
        })
    }
    exitCover=()=>{
        this.setState({
            cover:'',
            chatting_add_window_on:'',
            chatting_user_list_on:'',
            friend_profile_on:false,
            room_info_on:false
        })
    }
    render() {
        const getImageSrc = (data) => {
            const localStorageImageData = localStorage.getItem(data);
            if (localStorageImageData) {
                return `${localStorageImageData}`;
            } else {
                return process.env.PUBLIC_URL + '/img/main/kakao/default_profile_img.png';
            }
        };

        if(this.state.loading === false){
            return(
                <div className="loading-container">
                    <div className="loading-animation"></div>
                </div>
            )
        }
        if(this.state.loading === true){
            return(
                <div id="chat_join">
                    <div className={this.state.cover} onClick={this.exitCover}></div>
                    <div className="chat_join_header">
                        <div className="chat_join_header_menu">
                            <p className="chat_join_exit" onClick={this.exitChat}></p>
                        </div>
                        <div className="chatting_center">
                            <div className="chatting_box">
                                <div className="chatting_state">
                                    <p className="chatting_img" onClick={()=>(this.setState({room_info_on:this.state.room_info_on === false ? true : true, cover:'cover'}))}>

                                    </p>
                                    <div className="friend_profile_info">
                                        <p className="chatting_title">{this.props.roomName}</p>
                                        <p className="chatting_user_length" onClick={()=>(this.setState({chatting_user_list_on:this.state.chatting_user_list_on===''?'on':'', cover:'cover'}))}>{this.state.userLength}</p>
                                        <ul className={`chatting_user_list ${this.state.chatting_user_list_on}`}>
                                            <div>참가자</div>
                                            {this.state.userList.map((data, index)=>(
                                                <div key={index} className="friend_profile_box hover" onClick={()=>this.onFriendProfileWindow(data.profile_contact, data.profile_nickname)}>
                                                    <div className="friend_profile_state ">
                                                        <p className="friend_profile_img">
                                                            <picture>
                                                                <img src={data.profile_img} loading="lazy" alt=""/>
                                                            </picture>
                                                        </p>
                                                        <div className="friend_profile_info">
                                                            <p className="friend_nickname">{data.profile_nickname}</p>
                                                            <p className="friend_profile_text">{data.profile_text}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={`chatting_add_user `} onClick={()=>(this.setState({
                                chatting_add_user_on:this.state.chatting_add_user_on === '' ?'on':''}))}>
                                <ul className={`chatting_add_menu ${this.state.chatting_add_user_on}`}>
                                    <li onClick={()=>(this.setState({chatting_add_window_on:'on', cover:'cover'}))}>대화상대 초대하기</li>
                                    <li onClick={this.exitRoom}>채팅방 나가기</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="chat_join_center" ref={this.chatMessagesRef}>
                        {this.state.messages.map((message, index) => (
                            <div key={index}>
                                {message.type === 'CHAT' && (
                                    <div>
                                        {message.sender === this.state.username ? (
                                            <div className="my_message">
                                                <div className="my_message_state">
                                                    <p className="read_check">{message.unreadCount}</p>
                                                    <p>{this.formattedDate(message.sentAt)}</p>
                                                </div>
                                                <div className="my_message_box" >
                                                    {message.content.split('\n').map((line, lineIndex) => (
                                                        <span key={lineIndex}>{line}<br/></span>
                                                    ))}
                                                </div>
                                            </div>
                                        ):(
                                            <div className="your_message">
                                                <div className="your_image">
                                                    <img src={getImageSrc(message.check)} alt=""/>
                                                </div>
                                                <div className="your_message_box">
                                                    <span className="your_nickname">{message.sender}</span>
                                                    {message.content.split('\n').map((line, lineIndex) => (
                                                        <span key={lineIndex}>{line}<br/></span>
                                                    ))}
                                                </div>
                                                <div className="your_message_state">
                                                    <p className="read_check">{message.unreadCount}</p>
                                                    <p>{this.formattedDate(message.sentAt)}</p>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )}
                                {message.type === 'JOIN' && (
                                    <div className="status_box">
                                        <span>{message.sender}님이 연결되었습니다.</span>
                                    </div>
                                )}
                                {message.type === 'LEAVE' && (
                                    <div className="status_box">
                                        <span>{message.sender}님이 연결끊겼습니다.</span>
                                    </div>
                                )}
                                {message.type === 'ADD' && (
                                    <div>
                                        {this.state.username !== message.sender ? (
                                            <div className="status_box">
                                                <span>{this.state.username}님이 {message.sender}님을 초대 하였습니다.</span>
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                )}
                                {message.type === 'EXIT' && (
                                    <div className="status_box">
                                        <span>{message.sender}님이 나갔습니다.</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="chat_join_footer">
                        <div className="message_box">
                            <p onClick={()=>{this.setState({emoji_box:this.state.emoji_box===''?'on':''})}}>+</p>
                            <textarea value={this.state.messageInput} onChange={(e)=>this.setState({messageInput:e.target.value})}
                                      onKeyDown={this.sendMessage}/>
                        </div>
                        <div className={`emoji_box ${this.state.emoji_box}`}>
                            <div className="emoji_list">
                                <div className="emoji_item"></div>
                                <div className="emoji_item"></div>
                                <div className="emoji_item"></div>
                                <div className="emoji_item"></div>
                                <div className="emoji_item"></div>
                                <div className="emoji_item"></div>
                                <div className="emoji_item"></div>
                                <div className="emoji_item"></div>
                            </div>
                            <div className="emoji">
                            </div>
                        </div>
                    </div>
                    <div className={`chatting_add_window ${this.state.chatting_add_window_on}`}>
                        <div className="chatting_add_user_search">
                            <input type="text" placeholder="이름 검색"/>
                        </div>
                        <div>
                            {this.state.friendList.map((data, index)=>(
                                <div key={index} className="friend_profile_box hover" onClick={()=>(this.addFriendRoom(data.profile_contact, data.profile_nickname))}>
                                    <div className="friend_profile_state ">
                                        <p className="friend_profile_img">
                                            <picture>
                                                <img src={data.profile_img} loading="lazy" alt=""/>
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
                    {this.state.friend_profile_on && (
                        <div className={`friend_profile_on ${this.state.friend_profile_on}`}>
                            <FriendProfileWindow contact={this.state.friend_profile_contact}
                                                 nickname={this.state.friend_profile_nickname}
                                                 textEdit2={this.textEdit2}
                                                 exitCover={this.exitCover}/>
                        </div>
                    )}
                    {this.state.room_info_on &&(
                        <div className={`room_info_on ${this.state.room_info_on}`}>
                            <RoomProfileWindow roomId={this.state.roomId}
                                               exitCover={this.exitCover}/>
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default Chat