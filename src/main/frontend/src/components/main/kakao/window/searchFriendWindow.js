import {Component} from "react";

class SearchFriendWindow extends Component{
    constructor(props) {
        super(props);
        this.state={
            edit_contact_add_on:'',
            edit_contact_add:'',
            edit_contact_add_length:0,

            edit_contact_add_toggle1:'on',
            edit_contact_add_toggle2:'',

            friendName:'',
            friendNameLength:0,
            friendContact:'',

            friendEmail:'',
            friendEmailLength:0,

            loading:false,
            search_result:'',

        }
    }
    addToggle1=()=>{
        this.setState({
            edit_contact_add_toggle1:'on',
            edit_contact_add_toggle2:'',
            friendName:'',
            friendContact:''
        })
    }
    addToggle2=()=>{
        this.setState({
            edit_contact_add_toggle1:'',
            edit_contact_add_toggle2:'on',
            friendEmail:''
        })
    }
    getFriendName=(e)=>{
        this.setState({
            button:'',
            friendName:e.target.value,
            friendNameLength:e.target.value.length
        })
        if(this.state.friendContact.length >= 1 &&
            this.state.friendName.length >= 1){
            this.setState({
                button:'on'
            })
        }
    }
    getFriendContact=(e)=>{
        this.setState({
            button:'',
            friendContact:e.target.value
        })
        if(this.state.friendContact.length >= 1 &&
            this.state.friendName.length >= 1){
            this.setState({
                button:'on'
            })
        }
    }
    getFriendEmail=(e)=>{
        this.setState({
            friendEmail:e.target.value,
            friendEmailLength:e.target.value.length
        })
    }
    searchContactFriend=()=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/user/searchFriend?contact=${this.state.friendContact}&name=${this.state.friendName}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status >= 200 && xhr.status <300) {
                    this.setState({
                        warning_search:''
                    })
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
                        case 'self':
                            this.setState({
                                warning_search:'자신을 검색하였습니다.'
                            })
                            break;
                        case 'search_null':
                            this.setState({
                                warning_search:'해당 연락처는 존재하지 않습니다.'
                            })
                            break;
                        case 'duplicate':
                            this.setState({
                                warning_search:'이미 추가한 친구 입니다.'
                            })
                            break;
                        case 'failure':
                            this.setState({
                                warning_search:'알 수 없는 이유로 실패하였습니다.'
                            })
                            break;
                        default:
                            this.setState({
                                add_friend_profile_text:responseObj.friend_profileText,
                                add_friend_profile_nickname:responseObj.friend_nickname,
                                add_friend_profile_img:responseObj.friend_profileMainImg,
                                add_friend_profile_background_img:responseObj.friend_profileBackgroundImg,
                                loading:true,
                                search_result:'on'
                            })
                            this.props.getFriendList();
                            break;
                    }
                }
            }
        };
        xhr.send();
    }
    searchEmailFriend=(e)=>{
        if(e.key === 'Enter'){
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/user/searchFriend?email=${this.state.friendEmail}`);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE){
                    if (xhr.status >= 200 && xhr.status <300) {
                        this.setState({
                            warning_search:''
                        })
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
                            case 'self':
                                this.setState({
                                    warning_search:'자신을 검색하였습니다.'
                                })
                                break;
                            case 'search_null':
                                this.setState({
                                    warning_search:'해당 연락처는 존재하지 않습니다.'
                                })
                                break;
                            case 'failure':
                                this.setState({
                                    warning_search:'알 수 없는 이유로 실패하였습니다.'
                                })
                                break;
                            default:
                                this.setState({
                                    add_friend_profile_text:responseObj.friend_profileText,
                                    add_friend_profile_nickname:responseObj.friend_nickname,
                                    add_friend_profile_img:responseObj.friend_profileMainImg,
                                    add_friend_profile_background_img:responseObj.friend_profileBackgroundImg,
                                    loading:true,
                                    search_result:'on'
                                })
                                this.props.getFriendList();
                                break;
                        }
                    }
                }
            };
            xhr.send();
        }
    }

    render() {
        const{loading}=this.state;

        return (
            <div className="add_contact_on on">
                <h4>친구 추가</h4>
                <div className="add_contact_header">
                    <span id="contact_search" className={this.state.edit_contact_add_toggle1} onClick={this.addToggle1}>연락처로 추가</span>
                    <span id="id_search"className={this.state.edit_contact_add_toggle2} onClick={this.addToggle2}>ID로 추가</span>
                </div>

                <div className={`contact_search_form ${this.state.edit_contact_add_toggle1}`}>
                    <div>
                        <input type="text" placeholder="친구 이름" onChange={this.getFriendName} maxLength="20" x/>
                        <p>{this.state.friendNameLength}/20</p>
                    </div>
                    <div>
                        <input type="text"placeholder="전화번호" onChange={this.getFriendContact}maxLength="12"/>
                    </div>
                    <div>
                        <span>친구의 이름과 전화번호를 입력해 주세요.</span>
                        <span>{this.state.warning_search}</span>
                    </div>
                    <div>
                        <button className={this.state.button} onClick={this.searchContactFriend}>친구 추가</button>
                    </div>
                </div>

                <div className={`id_search_form ${this.state.edit_contact_add_toggle2}`}>
                    <div>
                        <input type="text" placeholder="친구 Email " onChange={this.getFriendEmail} onKeyDown={this.searchEmailFriend} maxLength="30"/>
                        <p>{this.state.friendEmailLength}/30</p>
                    </div>
                    <div>
                        <span>Email 검색을 허용한 친구만 찾을 수 있습니다.</span>
                        <span>{this.state.warning_search}</span>
                    </div>
                </div>

                <div id="search_result" className={this.state.search_result}>
                        <span>
                            {loading && (<img src={this.state.add_friend_profile_img} alt=""/>)}
                        </span>
                    <span>
                            {loading && (<p>{this.state.add_friend_profile_nickname}</p>)}
                        </span>
                    <span>
                            {loading && (<p>{this.state.add_friend_profile_text}</p>)}
                        </span>
                        <span>
                            {loading && (<p>친구 등록이 완료되었습니다.</p>)}
                        </span>
                </div>
            </div>
        );
    }
}

export default SearchFriendWindow