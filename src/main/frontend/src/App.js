import './App.css';
import { Component } from 'react';
import Start from './components/start.js'
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };
  render(){
          return(
              <div id="intro">
                  <Start/>
              </div>
          )
      }
}

export default App;