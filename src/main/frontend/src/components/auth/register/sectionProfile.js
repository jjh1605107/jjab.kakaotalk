import {Component} from "react";
import "../../../css/auth/register/sectionProfile.css"
import {faAngleDown, faAngleUp, faCheck} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
class SectionProfile extends Component{
    constructor(props) {
        super(props);
        this.state={
            number:0,
            max_number:20,
            clear:'',
            name:'',
            year:'',
            month:'',
            day:'',
            lunar:'false',
            profileObj:''
        }
    }

    componentDidMount = () => {
        if(this.props.getEmail !== ''){
            const yearSelect = document.querySelector('.yearSelect');
            const currentYear = new Date().getFullYear();
            if (yearSelect.options.length === 1) {
                for (let year = currentYear; year >= currentYear - 100; year--) {
                    const option = document.createElement("option");
                    option.text = `${year}`;
                    option.value = `${year}`;
                    yearSelect.appendChild(option);
                }
            }

            const monthSelect = document.querySelector(".monthSelect");
            if (monthSelect.options.length === 1) {
                for (let month = 1; month <= 12; month++) {
                    const option = document.createElement("option");
                    option.text = String(month);
                    option.value = String(month);
                    monthSelect.appendChild(option);
                }
            }

            const daySelect = document.querySelector(".daySelect");
            if (daySelect.options.length === 1) {
                for (let day = 1; day <= 31; day++) {
                    const option = document.createElement("option");
                    option.text = String(day);
                    option.value = String(day);
                    daySelect.appendChild(option);
                }
            }
            window.document.querySelector('.new_name').focus();
        }
    };
    lunarCheck=()=>{
        this.state.lunar === 'false' ?
            this.setState({
                lunar:'true'
            }) :
            this.setState({
                lunar:'false'
            });
    }
    limit=(e)=>{
        const textLength = e.target.value
        const count = textLength.length
        this.setState({
            number:`${count}`,
            name:e.target.value
        })
    }
    nullCheck=(e)=>{
        this.setState({
            warning1:''
        })
        if(e.target.value === ''){
            this.setState({
                warning1:'warning'
            })
        }
    }
    yearSelect=(e)=>{
        this.setState({
            clear:''
        })
        this.setState({
            year:e.target.value
        })
    }
    monthSelect=(e)=>{
        this.setState({
            clear:''
        })
        this.setState({
            month:e.target.value
        })
    }
    daySelect=(e)=>{
        this.setState({
            clear:''
        })
        this.setState({
            day:e.target.value
        })
    }
    clearCheck=()=>{
        this.setState({
            clear:''
        })
        if(this.state.name !== '' &&
            this.state.year !== ''&&
            this.state.month !== '' &&
            this.state.day !== ''){
            this.setState({
                clear:'clear'
            })
        }
    }
    getBtn3=()=>{
        if(this.state.clear === 'clear') {
            this.props.getProfile(this.state.name, this.state.year, this.state.month,this.state.day, this.state.lunar);
            this.props.increaseLevel();
        }
    }
    render(){
        if(this.props.getEmail === ''){
            this.props.renderBackup();
        }else {
            return (
                <div id="section-profile">
                    <div className="cont_signt" onBlur={this.clearCheck}>
                        <h2 className="tit_gt">
                            <span>짭카오계정 프로필을</span>
                            <span>설정해 주세요</span>
                        </h2>
                        <div className="box_tfff">
                            <strong className="tit_tfff">이름</strong>
                            <div>
                                <input onChange={this.limit} onBlur={this.nullCheck} type="text" className="new_name" placeholder="이름 입력" maxLength={this.state.max_number}/>
                                <label>
                                    <span>{this.state.number}/20</span>
                                </label>

                            </div>
                        </div>
                        <p className={`info_tff ${this.state.warning1}`}>이름을 입력해 주세요</p>
                        <div className="box_tfff">
                            <strong className="tit_tfff">생일</strong>

                            <div>
                                <select className="yearSelect" menuPlacement="bottom" value={this.state.year} onChange={this.yearSelect}>
                                    <option>연도</option>
                                </select>
                                <select className="monthSelect" menuPlacement="bottom" value={this.state.month} onChange={this.monthSelect}>
                                    <option>월</option>
                                </select>
                                <select className="daySelect" menuPlacement="bottom" value={this.state.day} onChange={this.daySelect}>
                                    <option>일</option>
                                </select>

                                <label className="check_box" onClick={this.lunarCheck}>
                                    <span><FontAwesomeIcon icon={faCheck} className={this.state.lunar}/></span>
                                    <span>음력</span>
                                </label>
                            </div>
                        </div>

                        <p className={`info_tff ${this.state.warning2}`}>생년월일을 입력해 주세요.</p>

                        <div className="confirm_btn" >
                            <button onClick={this.getBtn3} className={`btn_g ${this.state.clear}`}>다음</button>
                        </div>

                    </div>
                </div>
            )
        }
    }
}

export default SectionProfile