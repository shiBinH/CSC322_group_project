import React from 'react';
import {connect} from 'react-redux';
import {login} from '../actions/auth';
import uuid from "uuid";
import axios from 'axios';

class LoginPage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        "username":"jie lan",
        "password":"hfh"
      };
    }
    
    handleSubmit= ()=> {  
      //Set up correct username and password for login convenience
      axios.post('/login', {
        "username":this.state.username,
        "password":this.state.password
      })
      .then( (response)=> {
        this.props.startLogin(response.data); 
      })
      .catch(function (error) {
        console.log(error);
      });
 
    }
  
    render() {
      return (
        <div className="box-layout">
          <div className="box-layout__box">

            <label>
              UserName:
              <input type="text" name={"username"} onChange={()=>{
                  this.setState({ "username": event.target.value });
              }}  
            />
            </label>

            <label>
              password:
              <input type="text" name={"password"} onChange={()=>{
                  this.setState({ "password": event.target.value });
              }}  
            />
            </label>

            <div>
                <button type="button" onClick={()=>this.handleSubmit()} >submit</button>
            </div>
            
          </div>
      </div>
      );
    }
    
  }


const mapDispatchToProps = (dispatch) => ({
  startLogin: (userData) => dispatch(login(userData))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
