import {Component} from "react";
class RoomProfileWindow extends Component{
    constructor(props) {
        super(props);
        this.state={
            room_id:props.roomId,
            profile_text:'',
            profile_nickname:'',
            profile_img:'',
            profile_background_img:'',
            profile_edit_on:'',
            profile_edit_nickname:'',
            profile_edit_text:'',
            warning_edit:'',
            zoom_image_on:'',
            loading:false
        }
    }
    componentDidMount=()=> {
        this.getRoomInfo();
    }
    //삼항연산자
    editProfileState = () => {
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
    exitZoomImage=()=>{
        this.setState({
            zoom_image_on:''
        })
    }
    exitProfileEdit=()=>{
        this.setState({
            profile_edit_on:''
        })
    }
    editProfileBackgroundImage=()=>{
        this.setState({
            edit_background_image_on: this.state.edit_background_image_on==='on'?'' : 'on'
        })
    }
    changeProfileImage=()=>{
        const imageInput = window.document.getElementById('image_input')
        imageInput.click();
        imageInput.addEventListener('change', this.handleFileChange);
    }
    changeProfileBackgroundImage=()=>{
        const imageInput = window.document.getElementById('image_input2')
        imageInput.click();
        imageInput.addEventListener('change', this.handleFileChange2);
    }
    handleFileChange=(e)=> {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('profileMainImg', selectedImage)

            const progressBar = window.document.querySelector('.progress-bar');
            const progressLabel = window.document.querySelector('.progress');
            progressBar.style.display = 'block';

            xhr.open('POST', '/user/patchProfile')

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    progressBar.value = percentComplete;
                    progressLabel.style.width = percentComplete + '%';
                }
            });

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
                            case 'Unsupported File Type':
                                this.setState({
                                    warning_edit:"이미지 파일을 넣어주세요"
                                })
                                break;
                            case 'value_null':
                                alert("정싱적으로 접근해 주세요")
                                break;
                            default:
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    this.setState({
                                        warning_edit: "",
                                        profile_img: e.target.result
                                    });
                                    this.props.imageEdit(e.target.result);
                                };
                                reader.readAsDataURL(selectedImage);
                                break;
                        }
                    }
                }
            };
            xhr.send(formData);
        }
    }
    handleFileChange2=(e)=>{
        const selectedImage = e.target.files[0];
        if(selectedImage){
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('profileBackgroundImg', selectedImage);
            xhr.open('POST', '/user/patchProfile')
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
                         case 'Unsupported File Type':
                             this.setState({
                                 warning_edit:"이미지 파일을 넣어주세요"
                             })
                             break;
                         case 'value_null':
                             alert("정싱적으로 접근해 주세요")
                             break;
                         default:
                             const reader = new FileReader();
                             reader.onload = (e) => {
                                 this.setState({
                                     warning_edit: "",
                                     profile_background_img: e.target.result
                                 });
                             };
                             reader.readAsDataURL(selectedImage);
                             this.props.ImageEdit(responseObj.result);
                             break;
                     }
                 }
               }
             };
             xhr.send(formData);
        }
    }
    getRoomInfo=()=>{
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
        xhr.open('GET', `/chat/getRoomList?roomId=${this.state.room_id}`);
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
                                room_name:responseObj.roomName,
                                room_main_image:responseObj.roomMainImage,
                                room_user_count:responseObj.roomUsers
                            },()=>{this.setState({loading:true})})
                            break;
                    }
                }
            }
        };
        xhr.send();
    }
    profileEditSubmit=()=> {
        if(this.state.profile_edit_text === '' || this.state.profile_edit_nickname === ''){
            this.setState({
                warning_edit:'수정할 내용을 입력해 주세요'
            })
            return;
        }
        this.setState({
            profile_edit_on:''
        })
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('profileNickname', this.state.profile_edit_nickname);
        formData.append('profileText', this.state.profile_edit_text);
        xhr.open('PATCH', '/user/patchProfile');
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
                    case 'success':
                        this.setState({
                            profile_text:this.state.profile_edit_text,
                            profile_nickname:this.state.profile_edit_nickname,
                        })
                        this.props.getProfile()
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
        const {loading} = this.state;
        if(loading===false){
            return(
                <div className="loading-container">
                    <div className="loading-animation"></div>
                </div>
            )
        }
        if(loading===true){
            return(
                <div className={`profile_window`}>
                    {loading && (<img className="profile_background_img" src={process.env.PUBLIC_URL + '/img/main/kakao/default_background_img.jpg'} alt=""/> )}

                    {loading && (
                        <div className={`profile_header ${this.state.edit_background_image_on}`}>
                            <div onClick={this.editProfileBackgroundImage}>Click</div>
                            <div onClick={this.changeProfileBackgroundImage}>배경사진 바꾸기</div>
                            <input type="file" id="image_input2" accept="image/*"/>
                        </div>
                    )}

                    {loading &&(
                        <div className="profile_center">
                            <div className="profile_info">
                                <img src={this.state.profile_img} onClick={this.editProfileImage} alt=""/>
                                <p className={`profile_nickname`}>{this.state.profile_nickname}</p>
                                <p className={`profile_text`}>{this.state.profile_text}</p>
                            </div>
                        </div>
                    )}

                    {loading &&(
                        <div className="profile_footer">
                            <div className="item" onClick={this.editProfileState}>
                                편집
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
                            <h4>방제목 편집</h4>
                            <div onClick={this.exitProfileEdit}></div>

                            <img src={this.state.profile_img} onClick={this.changeProfileImage}/>
                            <input type="file" id="image_input" accept="image/*"/>

                            <div className="progress-bar">
                                <div className="progress"></div>
                            </div>

                            <div className="edit_nickname_form">
                                <input type="text" maxLength="8" defaultValue={this.state.profile_nickname} onChange={(e)=>{this.setState({profile_edit_nickname:e.target.value})}}/>
                            </div>

                            <div className="edit_text_form">
                                <input type="text" maxLength="10" defaultValue={this.state.profile_text} onChange={(e)=>{this.setState({profile_edit_text:e.target.value})}}/>
                            </div>
                            <span>{this.state.warning_edit}</span>
                            <div className="edit_button_form">
                                <button onClick={this.profileEditSubmit}>확인</button>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }
}
export default RoomProfileWindow