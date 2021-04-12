import React, { Component, ChangeEvent } from 'react'
import "./register.css";
import axios from "axios";
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import config from '../../config';
import { UserRegisterDetails } from '../../models/UserRegisterDetails';
import { UserLoginDetails } from '../../models/UserLoginDetails';
import Modal from '../modal/modal';

//Declare state variables (state - model,a box of data that each component maintains).
//Every change or update of the state,there's a call to render function(the component is re-rendered)
interface RegisterState {
    userName: string,
    password: string,
    firstName: string,
    lastName: string,
    isLoginned: boolean,
    isModalOpen: boolean
}
//The class inherits the functionality of Component class
export default class Register extends Component<any, RegisterState>{
    //Declare class variables
    private passwordRegex: RegExp;
    private emailRegex: RegExp;
    private nameRegex: RegExp;
    private unsubscribeStore: any;
    private modalContent: string
    //Initalize Props object, State object, class variables.
    public constructor(props: any) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            firstName: '',
            lastName: '',
            isLoginned: false,
            isModalOpen: false

        };
        this.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,8}$/;
        this.emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.nameRegex = /^[a-z]+$/i;
        this.modalContent = ""

        this.unsubscribeStore = store.subscribe(
            //  the following function is our "listener", "refresh function"
            () => this.setState(
                {
                    isLoginned: store.getState().isLoginned

                })
        );
    }




    //Callback in life cycle hooks of the component (where the component is destroyed)
    componentWillUnmount() {
        this.unsubscribeStore();
    }




    //Callback in life cycle hooks of the component (where the component is initalized)
    public componentDidMount() {
        this.checkIsUserLoginned()
    }




    //check if the user is loginned
    private checkIsUserLoginned() {
        if (store.getState().isLoginned) {
            this.props.history.push('/home')
        }
    }

    //sets user name
    private setUserName = (args: ChangeEvent<HTMLInputElement>) => {
        const userName = args.target.value;
        this.setState({ userName });
    }
    

    //sets password
    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        this.setState({ password });
    }


    //sets first name
    private setFirstName = (args: ChangeEvent<HTMLInputElement>) => {
        const firstName = args.target.value;
        this.setState({ firstName });
    }



    //sets last name
    private setLastName = (args: ChangeEvent<HTMLInputElement>) => {
        const lastName = args.target.value;
        this.setState({ lastName });
    }



    //checks if the input fields are valid
    private areInputFieldsValidate = () => {
        if (this.passwordRegex.test(this.state.password) && this.emailRegex.test(this.state.userName) && this.nameRegex.test(this.state.firstName) && this.nameRegex.test(this.state.lastName)) {
            return true;
        }
        return false
    }



    //callback returns the user back to pervious component
    private onBackClicked = () => {
        this.props.history.push('/home')
    }



    //callback,triggered when the user register
    private onRegisterClicked = async () => {
        let userRegisterDetails = new UserRegisterDetails(this.state.firstName, this.state.lastName, this.state.userName, this.state.password)
        console.log(userRegisterDetails)
        try {
            this.setState({ isModalOpen: false })

            let userLoginDetails = new UserLoginDetails(this.state.userName, this.state.password);
            await axios.post<void>(`${config.domain}/users/register`, userRegisterDetails);
            store.dispatch({ type: ActionType.Register, payload: userLoginDetails });
            this.props.history.push('/home')


        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })
        }
    }









    //Html Code
    public render() {
        return (
            <div id="registerDiv">

                <div className="container">
                    <h1>Sign Up</h1><br />

                    <div className="form-group">
                        <input type="text" className="form-control" value={this.state.firstName} onChange={this.setFirstName} id="firstName" placeholder="Insert your first name..." name="firstName" />
                        {this.state.firstName === "" && <span>Please fill out this field</span>}
                        {this.state.firstName !== "" && !this.nameRegex.test(this.state.firstName) && <span>You can insert only letters.</span>} <br />

                    </div>

                    <div className="form-group">
                        <input type="text" className="form-control" value={this.state.lastName} onChange={this.setLastName} id="lastName" placeholder="Insert your last name..." name="lastName" />
                        {this.state.lastName === "" && <span>Please fill out this field</span>}
                        {this.state.lastName !== "" && !this.nameRegex.test(this.state.lastName) && <span>You can insert only letters.</span>} <br />

                    </div>

                    <div className="form-group">
                        <input type="text" className="form-control" value={this.state.userName} onChange={this.setUserName} id="email" placeholder="Enter email..." name="email" />
                        {this.state.userName === "" && <span>Please fill out this field</span>}
                        {this.state.userName !== "" && !this.emailRegex.test(this.state.userName) && <span>Email must be a valid email address.</span>} <br />

                    </div>

                    <div className="form-group">
                        <input type="password" className="form-control" value={this.state.password} onChange={this.setPassword} id="pwd" placeholder="Enter password..." name="pswd" />
                        {this.state.password === "" && <span>Please fill out this field</span>}
                        {this.state.password !== "" && !this.passwordRegex.test(this.state.password) && <span>Must contain at least one number and one uppercase and lowercase letter, and at least 6 up to 8  characters.</span>}
                    </div>


                    <button type="submit" className="btn btn-primary" onClick={this.onRegisterClicked} disabled={!(this.state.userName && this.state.password && this.state.firstName && this.state.lastName && this.areInputFieldsValidate())}>sign up</button>
                    <button type="button" className="btn btn-primary" onClick={this.onBackClicked} >back</button>
                </div>
                {this.state.isModalOpen && <Modal open={this.state.isModalOpen} content={this.modalContent} />}

            </div>
        );
    }
}