import React, { Component } from "react";
import "../../css/main/chattingRoom.css";
import Profile from "./kakao/profile";
import Chatting from "./kakao/chatting"
import AddPlus from "./kakao/addPlus"
class ChattingRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "toggle1",
        };
    }
    toggleTab = (tabName) => {
        this.setState({
            activeTab:tabName
        });
    };

    render() {
        const { activeTab } = this.state;
        return (
            <div id="chatting-room">
                <div className="chatting-center">
                    {activeTab === "toggle1" && <Profile />}
                    {activeTab === "toggle2" && <Chatting/>}
                    {activeTab === "toggle3" && <AddPlus />}
                </div>
                <div className="chatting-footer">
                    <div className="item" onClick={() => this.toggleTab("toggle1")}>
                        <img src="" alt="" />
                    </div>
                    <div className="item" onClick={() => this.toggleTab("toggle2")}>
                        <img src="" alt="" />
                    </div>
                    <div className="item" onClick={() => this.toggleTab("toggle3")}>
                        <img src="" alt="" />
                    </div>
                </div>
            </div>
        );
    }
}

export default ChattingRoom;