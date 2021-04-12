import React, { Component } from 'react'
import { SuccessfulLoginServerResponse } from '../../models/SuccessfulLoginServerResponse';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import "./header.css"

//Declare state variables (state - model,a box of data that each component maintains).
//Every change or update of the state,there's a call to render function(the component is re-rendered)
interface HeaderState {
    userData: SuccessfulLoginServerResponse
    isloginned: boolean
}

//The class inherits the functionality of Component class
export default class Header extends Component<any, HeaderState>{
    //Initalize Props object, State object, class variables.
    public constructor(props: any) {
        super(props);
        this.state = {
            userData: null,
            isloginned: false
        };
        // Every change in the store's state, will cause a call to the callback
        // method, supplied in the subscribe method
        // No need to relate to the unsubsribe method, returned by subscribe()
        // because menu isn't dynamic, and will always be displayed
        store.subscribe(() => this.setState(
            {
                userData: store.getState().userData
            })
        );
    }



    //Callback in life cycle hooks of the component (where the component is initalized)
    public componentDidMount() {
        this.checkIsUserLoginned();
    }





    //checks if user is loginned
    private checkIsUserLoginned() {
        let userData = JSON.parse(sessionStorage.getItem("storedUserData"))

        if (userData) {
            store.dispatch({ type: ActionType.GetUserDataFromSessionStorage, payload: userData });
            store.dispatch({ type: ActionType.Login, payload: true });
        }
    }








    //Html Code:
    public render() {
        return (

            <div className=" container-fluid">


                <div className="row">

                    <div className="col-lg-4 col-sm-12" >
                        <img src="/pics/logo.png" alt="logo" id="logo" />
                    </div>

                    <div className="col-lg-4  col-sm-0" >

                    </div>
                    <div className="col-lg-4  col-sm-12" >
                        <p>contact us: UnitedVacations@gmail.com <br /> +972 054 5454875 <br />
                            {this.state.userData && <span><b><i>Hello {this.state.userData.firstName} {this.state.userData.lastName}</i></b></span>}
                        </p>
                    </div>
                </div>
            </div>





        );
    }
}


