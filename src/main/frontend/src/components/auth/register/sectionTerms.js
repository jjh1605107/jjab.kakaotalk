import {Component} from "react";
import '../../../css/auth/register/sectionTerms.css'
class SectionTerms extends Component{
    constructor(props) {
        super(props);
        this.state={
            isChecked: [false, false, false, false, false]
        }
    }

    checkbox = (number) => {
        if(number === 0){
            this.setState((e) => {
                const allToggled = e.isChecked.every((item) => !item);
                const allChecked = e.isChecked.map(() => allToggled);
                return {
                    isChecked: allChecked
                };
            });
        }else{
            this.setState((e) => {
                const updated = [...e.isChecked];
                updated[number] = !e.isChecked[number];
                return {
                    isChecked: updated
                };
            });
        }
    };
    submit_clear=()=>{
        if(this.state.isChecked[2]===false||this.state.isChecked[4]===false){
            alert("필수 항목은 다 체크해야함")
        }else{
            this.props.increaseLevel();
        }
    }
    render() {
        const {isChecked} = this.state;
        const hasChecked = isChecked.some((item) => item);

        return(
            <section id="section-terms">
                <div className="active_two">
                    <div>
                        <span>짭카오계정</span>
                        <span>서비스 약관에 동의해 주세요.</span>
                    </div>

                    <div className="item_box" onClick={this.checkbox.bind(this,0)}>
                        <div className="item_two">
                            <input type="checkbox" className="checkbox_two" checked={this.state.isChecked[0]}/>
                            <div>
                                <span>모두 동의합니다.</span>
                                <span>전체 동의는 필수 및 선택정보에 대한 동의도 포함되어 있으며, 개별적으로도 동의를 선택하실 수 있습니다.</span>
                            </div>
                        </div>
                    </div>

                    <div className="item_box" onClick={this.checkbox.bind(this,1)}>
                        <div className="item_two">
                            <input type="checkbox" className="checkbox_two" checked={this.state.isChecked[1]}/>
                            <div>
                                <span>만14세 이상입니다</span>
                            </div>
                        </div>
                    </div>
                    <div className="item_box" onClick={this.checkbox.bind(this,2)}>
                        <div className="item_two">
                            <input type="checkbox" className="checkbox_two" checked={this.state.isChecked[2]}/>
                            <div>
                                <span>[필수] 짭카오 통합서비스 약관</span>
                            </div>
                        </div>
                    </div>
                    <div className="item_box" onClick={this.checkbox.bind(this,3)}>
                        <div className="item_two">
                            <input type="checkbox" className="checkbox_two" checked={this.state.isChecked[3]}/>
                            <div>
                                <span>[선택] 약관1</span>
                            </div>
                        </div>
                    </div>
                    <div className="item_box" onClick={this.checkbox.bind(this,4)}>
                        <div className="item_two">
                            <input type="checkbox" className="checkbox_two" checked={this.state.isChecked[4]}/>
                            <div>
                                <span>[필수] 약관2</span>
                            </div>
                        </div>
                    </div>
                    <div className={`submit_btn ${hasChecked ? "selected" : ""}`} onClick={this.submit_clear}>
                        <span>동의</span>
                    </div>
                </div>
            </section>
        )
    }
}

export default SectionTerms