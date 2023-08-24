import {Component} from "react";
import Error from "./register/error"

import SectionAuth from "./register/sectionAuth";
import SectionTerms from "./register/sectionTerms";
import SectionEmail from "./register/sectionEmail"
import SectionPassword from "./register/sectionPassword"
import SectionProfile from "./register/sectionProfile"
import SectionHelloWorld from "./register/sectionHelloWorld"
import '../../css/auth/register.css';
class Register extends Component{
    constructor(props) {
        super(props);
        this.state = {
            level:1
        }
    }

    renderContainer=()=>{
        const { level } = this.state;
        switch (level){
            case 0:
                return <Error increaseLevel={this.increaseLevel} />
                break;
            case 1:
                return <SectionTerms increaseLevel={this.increaseLevel}/>
                break;
            case 2:
                return <SectionEmail increaseLevel={this.increaseLevel}
                                     inputEamil={this.inputEmail}
                                     renderBackup={this.renderBackup}/>
                break;
            case 3:
                return <SectionPassword increaseLevel={this.increaseLevel}
                                        getEmail={this.state.email}
                                        inputPassword={this.inputPassword}
                                        renderBackup={this.renderBackup} />
                break;
            case 4:
                return <SectionProfile increaseLevel={this.increaseLevel}
                                       getEmail={this.state.email}
                                       renderBackup={this.renderBackup}
                                       getProfile={this.inputProfile}/>
                break;
            case 5:
                let birthdate = this.state.year + "-" + this.state.month + "-" + this.state.day;
                return <SectionAuth email={this.state.email}
                                    password={this.state.password}
                                    name={this.state.name}
                                    birthdate={birthdate}
                                    lunar={this.state.lunar}
                                    increaseLevel={this.increaseLevel}/>
                break;
            case 6:
                return <SectionHelloWorld renderBackup={this.renderBackup}
                                          email={this.state.email}
                                          name={this.state.name}/>
                break;
            default:
                break;
        }
    }
    increaseLevel = (e) => {
        const num = this.state.level + 1
        this.setState({level:num});
    };
    inputEmail=(e)=>{
        this.setState({
            email:e
        })
    }
    inputPassword=(e)=>{
        this.setState({
            password:e
        })
    }
    inputProfile=(name, year, month, day, lunar)=>{
        this.setState({
            name:name,
            year:year,
            month:month,
            day:day,
            lunar:lunar
        })
    }
    renderBackup=()=>{
        this.setState({
            level:0
        })
    }
    render() {
        return(
            <div id="register_container" className="loading">
                <div className="title">짭카오</div>
                {this.renderContainer()}
                <div className="register_footer">
                    Copyright © 짭카오 Corp. All rights reserved.
                </div>
            </div>
        )
    }
}

export default Register