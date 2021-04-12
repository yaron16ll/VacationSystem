import React, { Component, ChangeEvent } from 'react'
import "./login.css";
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { SuccessfulLoginServerResponse } from '../../models/SuccessfulLoginServerResponse';
import axios from "axios";
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import config from '../../config';
import Modal from '../modal/modal';

//Declare state variables (state - model,a box of data that each component maintains).
//Every change or update of the state,there's a call to render function(the component is re-rendered)
interface LoginState {
    userName: string,
    password: string,
    isLoginned: boolean,
    vacationsButtonValue: string,
    isModalOpen: boolean
}
//The class inherits the functionality of Component class
export default class Login extends Component<any, LoginState>{
    //Declare class variables
    private passwordRegex: RegExp;
    private emailRegex: RegExp;
    private unsubscribeStore: any;
    private modalContent: string
    //Initalize Props object, State object, class variables.
    public constructor(props: any) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            isLoginned: false,
            vacationsButtonValue: "",
            isModalOpen: false
        };
        this.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,8}$/;
        this.emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
    public componentWillUnmount() {
        this.unsubscribeStore();
    }



    //Callback in life cycle hooks of the component (where the component is initalized)
    public componentDidMount() {
        this.checkUserType()
        let userLoginDetails = store.getState().userLoginDetails

        if (userLoginDetails) {
            this.login(userLoginDetails)
            store.dispatch({ type: ActionType.Register, payload: null });
        }
    }



    //checks user type
    private checkUserType() {
        if (store.getState().isLoginned) {
            this.setState({ isLoginned: true })
            let userData = JSON.parse(sessionStorage.getItem('storedUserData'))
            if (userData.userType === "CUSTOMER") {
                this.setState({ vacationsButtonValue: "Follow Vacations" })
            }
            else {
                this.setState({ vacationsButtonValue: "Manage Vacations" })
            }
        }
    }


    //sets user name
    private setUserName = (args: ChangeEvent<HTMLInputElement>) => {
        let userName = args.target.value;
        this.setState({ userName });
    }



    //sets password
    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        let password = args.target.value;
        this.setState({ password });
    }


    //checks if the input fields are valid
    private areInputFieldsValidate = () => {
        if (this.passwordRegex.test(this.state.password) && this.emailRegex.test(this.state.userName)) {
            return true;
        }
        return false
    }



    //callback, triggered when the user sign up
    private onSignUpClicked = () => {
        this.props.history.push('/register')
    }



    //callback goes the user to Vacation component
    private onPassVacationsClicked = () => {
        this.props.history.push('/vacations')
    }


    //callback,triggered when the user logins
    private onLoginClicked = async () => {
        let userLoginDetails = new UserLoginDetails(this.state.userName, this.state.password);
        console.log(userLoginDetails)
        this.setState({ isModalOpen: false })
        await this.login(userLoginDetails)
    }


//sends a login request(post request)
    private async login(userLoginDetails: UserLoginDetails) {
        try {
            const response = await axios.post<SuccessfulLoginServerResponse>(`${config.domain}/users/login`, userLoginDetails);
            let serverResponse = response.data;
            sessionStorage.setItem("storedUserData", JSON.stringify(serverResponse))
            console.log(serverResponse)
            store.dispatch({ type: ActionType.GetUserDataFromSessionStorage, payload: serverResponse });
            store.dispatch({ type: ActionType.Login, payload: true });
            this.checkUserType()

        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })
        }
    }


//callback,is fired when the user logs out
    private onDisconnectClicked = async () => {
        try {
            let userToken = store.getState().userData.token
            await axios.post<void>(`${config.domain}/users/disconnect`, { "token": userToken });
            sessionStorage.clear()
            store.dispatch({ type: ActionType.GetUserDataFromSessionStorage, payload: null });
            store.dispatch({ type: ActionType.GetAllVacations, payload: [] });
            store.dispatch({ type: ActionType.Login, payload: false });
            store.dispatch({ type: ActionType.GetAllFollowingVacations, payload: [] });
            this.setState({ isModalOpen: false, vacationsButtonValue: "" })

        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })
        }
    }












    //Html Code
    public render() {
        return (
            <div id="login">

                <div className="container">
                    <h1>Login</h1><br />

                    <div className="form-group">
                        <input type="email" className="form-control" value={this.state.userName} onChange={this.setUserName} id="email" placeholder="Insert an email..." name="email" />
                        {this.state.userName === "" && <span>Please fill out this field</span>}
                        {this.state.userName !== "" && !this.emailRegex.test(this.state.userName) && <span>Email must be a valid email address.</span>}

                    </div>

                    <div className="form-group">
                        <input type="password" className="form-control" value={this.state.password} onChange={this.setPassword} id="pwd" placeholder="Insert a password..." name="pswd" />
                        {this.state.password === "" && <span>Please fill out this field</span>}
                        {this.state.password !== "" && !this.passwordRegex.test(this.state.password) && <span>Must contain at least one number and one uppercase and lowercase letter, and at least 6 up to 8  characters.</span>} <br />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={this.onLoginClicked} disabled={store.getState().isLoginned || !(this.state.userName && this.state.password && this.areInputFieldsValidate())}>login</button>
                    <button type="submit" className="btn btn-primary" onClick={this.onDisconnectClicked} disabled={!store.getState().isLoginned}>log out</button>
                    <button type="button" className="btn btn-link" onClick={this.onSignUpClicked} >sign up</button>
                    {this.state.isLoginned && <button id="vacation-btn" type="button" className="btn btn-info" onClick={this.onPassVacationsClicked} >{this.state.vacationsButtonValue}</button>}

                </div>

                {this.state.isModalOpen && <Modal open={this.state.isModalOpen} content={this.modalContent} />}

            </div>
        );
    }
}

