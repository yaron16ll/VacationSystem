import React, { Component } from 'react'
import { store } from '../../redux/store';
import "./vacations.css";
import axios from "axios";
import config from '../../config';
import { ActionType } from '../../redux/action-type';
import { SuccessfulGetAllVacationResponse } from '../../models/SuccessfulGetAllVacationResponse';
import { Vacation } from '../../models/Vacation';
import DatePicker from "react-datepicker";
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import RefreshIcon from '@material-ui/icons/Refresh';
import "react-datepicker/dist/react-datepicker.css";
import Modal from '../modal/modal';


//Declare state variables (state - model,a box of data that each component maintains).
//Every change or update of the state,there's a call to render function(the component is re-rendered)
interface VacationsState {
    allVacations: Vacation[],
    searchByStartDate: Date,
    searchByEndDate: Date,
    searchByDescription: string,
    isCustomer: boolean,
    isModalOpen: boolean

}
//The class inherits the functionality of Component class
export default class Vacations extends Component<any, VacationsState>{
    //Declare class variables
    private unsubscribeStore: any;
    private minDate: Date;
    private isShown: boolean;
    private modalContent: string
    //Initalize Props object, State object, class variables.
    public constructor(props: any) {
        super(props);
        this.state = {
            allVacations: [],
            searchByStartDate: null,
            searchByEndDate: null,
            searchByDescription: "",
            isCustomer: false,
            isModalOpen: false
        };
        this.minDate = new Date()
        this.isShown = false
        this.modalContent = ""

        this.unsubscribeStore = store.subscribe(
            //  the following function is our "listener", "refresh function"
            () => this.setState(
                {
                    allVacations: store.getState().allVacations,
                })
        );
    }


    //Callback in life cycle hooks of the component (where the component is destroyed)
    public componentWillUnmount() {
        this.unsubscribeStore();
    }



    //Callback in life cycle hooks of the component (where the component is initalized)
    public async componentDidMount() {
        if (store.getState().isLoginned) {
            this.setUserType()
            await this.getAllvacations();
        }
        else {
            this.props.history.push('/home')
        }
    }



    //gets all vacations
    private async getAllvacations() {

        if (store.getState().allVacations === null || store.getState().allVacations.length === 0) {
            try {
                this.setState({ isModalOpen: false })
                let response = await axios.get<SuccessfulGetAllVacationResponse>(`${config.domain}/vacations/all`);
                let serverResponse = response.data;
                console.log(serverResponse, 'response')

                this.checkUserType(serverResponse)
            }
            catch (err) {
                this.modalContent = err.response.data.error;
                this.setState({ isModalOpen: true })

            }
        }
        else {
            this.setState({ allVacations: store.getState().allVacations })
        }
    }



    //sets user type
    private setUserType() {
        if (store.getState().userData.userType === "CUSTOMER") {
            this.setState({ isCustomer: true })
        }
    }

    //checks user type 
    private checkUserType(serverResponse: SuccessfulGetAllVacationResponse) {
        if (this.state.isCustomer) {
            this.addIsFollowingProperty(serverResponse)

        }
        else {

            store.dispatch({ type: ActionType.GetAllVacations, payload: serverResponse.allVacations });

        }
    }


    //adds Is following property
    private addIsFollowingProperty(serverResponse: SuccessfulGetAllVacationResponse) {
        for (let vacation of serverResponse.allVacations) {
            vacation.isFollowing = false;
        }
        this.findFollowingVacations(serverResponse)
    }

    //finds followinig vacations
    private findFollowingVacations(serverResponse: SuccessfulGetAllVacationResponse) {
        let allMyFollowedVacations = serverResponse.allMyFollowedVacations;
        let allVacations = serverResponse.allVacations;

        this.setIsFollowing(allVacations, allMyFollowedVacations)
        this.sortArrayByfollowings(allVacations)

        store.dispatch({ type: ActionType.GetAllVacations, payload: allVacations });


        console.log(this.state.allVacations)
    }



    //sorts array by user's followings
    private sortArrayByfollowings(allVacations: Vacation[]): void {
        allVacations.sort((a, b) => (a.isFollowing > b.isFollowing ? -1 : 1));
    }



    //sets is following property
    private setIsFollowing(allVacations: Vacation[], allMyFollowedVacations: number[]): void {
        allVacations.forEach((vacation, index, allVacations) => {
            if (allMyFollowedVacations.indexOf(vacation.id) !== -1) {
                console.log(vacation.id)
                allVacations[index].isFollowing = true
            }
        });
    }



    //callback,triggered when the user search vacations by description
    private onSearchByDescriptionChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        let text = event.target.value;
        this.setState({ searchByDescription: text });
    }



    //callback,triggered when the user search vacations by start end
    private onSearchByEndDateChanged = (date: Date) => {
        this.setState({
            searchByEndDate: date
        });
    };



    //callback,triggered when the user search vacations by start date
    private onSearchByStartDateChanged = (date: Date) => {
        this.setState({
            searchByStartDate: date
        });
    };



    //formats a date
    private formatDate(date: Date): string {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [month, day, year].join('/');
    }



    //callback,triggered when the user follows a vacation
    private onFollowClicked = (vacation: Vacation, allVacations: Vacation[]) => {
        if (!vacation.isFollowing) {
            console.log("here")

            console.log(vacation.isFollowing)

            this.addFollowing(vacation, allVacations)
        } else {
            console.log("there")

            console.log(vacation.isFollowing)

            this.deleteFollowing(vacation, allVacations)
        }
    }



    //adds a following
    private async addFollowing(vacation: Vacation, allVacations: Vacation[]) {
        try {
            await axios.post<void>(`${config.domain}/followings`, { vacationId: vacation.id });
            vacation.isFollowing = !vacation.isFollowing
            vacation.followings_amount++;
            this.sortArrayByfollowings(allVacations)
            this.setState({ allVacations: allVacations, isModalOpen: false });
        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })

        }
    }


    //deletes a following
    private async deleteFollowing(vacation: Vacation, allVacations: Vacation[]) {
        try {
            await axios.delete<void>(`${config.domain}/followings?vacationId=${vacation.id}`);
            vacation.isFollowing = !vacation.isFollowing
            vacation.followings_amount--
            this.sortArrayByfollowings(allVacations)
            this.setState({ allVacations: allVacations, isModalOpen: false });

        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })

        }
    }


    //callback,triggered when the user reset the Description input 
    private onResetDescriptionClicked = () => {
        this.setState({ searchByDescription: "" });
    };


    //callback,triggered when the user reset the Start Date input 
    private onResetStartDateClicked = () => {
        this.setState({ searchByStartDate: null });
    };

    //callback,triggered when the user delete a vacation 
    private onResetEndDateClicked = () => {
        this.setState({ searchByEndDate: null });
    };

    //callback,triggered when the user edit a vacation 
    private onEditVacationClicked = (vacation: Vacation) => {
        console.log(vacation)
        store.dispatch({ type: ActionType.GetEdittedVacation, payload: vacation });
        store.dispatch({ type: ActionType.SetButtonActionState, payload: "editing" });
        this.props.history.push('/addVacation')

    };


    //callback,triggered when the user delete a vacation 
    private onDeleteVacationClicked = async (selectedVacation: Vacation, allVacations: Vacation[]) => {
        await this.deleteAllFollowings(selectedVacation)
        await this.deleteVacation(selectedVacation, allVacations);
    };


    //updates graph
    private updateGraph(selectedVacation: Vacation) {

        let allFollowingVacations = store.getState().allFollowingVacations;
        let newAllFollowingVacations = allFollowingVacations.filter(vacation => vacation.id !== selectedVacation.id);

        store.dispatch({ type: ActionType.GetAllFollowingVacations, payload: newAllFollowingVacations });
        console.log(newAllFollowingVacations)


    }


    //deletes a vacation
    private async deleteVacation(selectedVacation: Vacation, allVacations: Vacation[]) {

        try {
            this.setState({ isModalOpen: false })
            await axios.delete<void>(`${config.domain}/vacations/${selectedVacation.id}`);
            let newAllVacations = allVacations.filter(vacation => vacation.id !== selectedVacation.id);
            console.log(newAllVacations)
            this.updateGraph(selectedVacation);
            store.dispatch({ type: ActionType.GetAllVacations, payload: newAllVacations });

            console.log(this.state.allVacations)
        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })

        }
    }


    //deletes all followings
    private async deleteAllFollowings(selectedVacation: Vacation) {

        try {
            this.setState({ isModalOpen: false })
            await axios.delete<void>(`${config.domain}/followings/allFollowings?vacationId=${selectedVacation.id}`);
        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })

        }
    }


    //callback passes the user the Add vacation component
    private onAddVacationClicked = () => {
        store.dispatch({ type: ActionType.SetButtonActionState, payload: "adding" });
        this.props.history.push('/addVacation')
    };

    //callback passes the user the Graph component
    private onGraphClicked = () => {
        this.props.history.push('/graph')
    };

    //callback,returns the user to the pervious component
    private onBackClick = () => {
        this.props.history.push('/home')
    }






    //Html Code
    public render() {
        return (

            
            <div id="vacations" >
                  <button id="back" type="button" className="btn btn-primary" onClick={this.onBackClick} name="back">Back</button>
                <h1>Vacations</h1>
                <br></br>
                <div id="add-vacations">
                    {!this.state.isCustomer && <button className="btn btn-primary" onClick={this.onAddVacationClicked} name="Add Vacation"> Add Vacation </button>}
                    {!this.state.isCustomer && <button className="btn btn-primary" id="graph-btn" onClick={this.onGraphClicked} name="Watch Vacations">Following Vacations</button>}
                  
                </div>




                {this.state.isCustomer && <form id="searchForm">
                    <DatePicker className="datePickerPipe"

                        selected={this.state.searchByStartDate}
                        onChange={this.onSearchByStartDateChanged}
                        minDate={this.minDate}
                        placeholderText="Select a start date..."
                    />
                    <button type="button" className="btn-reset" onClick={this.onResetStartDateClicked} name="ResetStartDate" value="Reset Start Date"><RefreshIcon></RefreshIcon></button>


                    <DatePicker
                        className="datePickerPipe"
                        disabled={this.state.searchByStartDate == null}
                        selected={this.state.searchByEndDate}
                        onChange={this.onSearchByEndDateChanged}
                        minDate={this.state.searchByStartDate}
                        placeholderText="Select an end date..."
                    />
                    <button type="button" className="btn-reset" onClick={this.onResetEndDateClicked} name="ResetEndDate" value="Reset End Date" ><RefreshIcon></RefreshIcon></button>

                    <input type="text" onChange={this.onSearchByDescriptionChanged} value={this.state.searchByDescription} placeholder="Search by Description..." name="searchByDescription" id="searchByDescription" />

                    <button type="button" className="btn-reset" onClick={this.onResetDescriptionClicked} name="ResetDescription" value="Reset Description"><RefreshIcon></RefreshIcon></button>


                </form>}

                <div className="container">

                    <div className="row">
                        {this.state.allVacations.filter(vacation => {
                            if (this.state.searchByDescription === "") {
                                this.isShown = false;
                                return true;
                            }

                            this.isShown = true
                            return vacation.description.includes(this.state.searchByDescription)
                        }
                        ).filter(vacation => {
                            if (this.state.searchByStartDate === null) {
                                this.isShown = false
                                return true;
                            }

                            this.isShown = true
                            return vacation.startDate === this.formatDate(this.state.searchByStartDate)
                        }
                        ).filter(vacation => {
                            if (this.state.searchByEndDate === null) {
                                this.isShown = false
                                return true;
                            }

                            if (vacation.endDate === this.formatDate(this.state.searchByEndDate)) {
                                this.isShown = false
                            }

                            return vacation.endDate === this.formatDate(this.state.searchByEndDate)
                        }
                        ).map(vacation =>
                            <div className="col-sm-4" key={vacation.id}>
                                <div className="card border-black mb-4" >
                                    <div className="card-header">
                                        <h3 id="destinationNameHeader">{vacation.destinationName} </h3>
                                        <div id="follow-btns">
                                            {this.state.isCustomer && <button id="followBtn" onClick={() => { this.onFollowClicked(vacation, this.state.allVacations) }} className={vacation.isFollowing ? 'followed' : 'unfollowed'}>{vacation.isFollowing ? 'Followed' : 'Unfollowed'}</button>}
                                             {!this.state.isCustomer && <div id="edits">
                                           <button className="adminBtn" onClick={() => { this.onEditVacationClicked(vacation) }} ><EditIcon></EditIcon></button> 
                                             <button className="adminBtn" onClick={() => { this.onDeleteVacationClicked(vacation, this.state.allVacations) }} ><ClearIcon></ClearIcon></button> 
                                        </div>}
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h4>{vacation.city} </h4>

                                        <p className="card-description" >{vacation.description}</p>
                                        <img className="card-img-top" src={`${config.domain}/uploads/${vacation.picture}`} alt="vacation" /><br /><br />
                                        <h5 className="card-text" >The amount of followings: {vacation.followings_amount}</h5>

                                        <h5 className="card-price" >The price: ₪{vacation.price.toLocaleString()
                                        }</h5>
                                    </div>
                                    <div className="card-footer border-black"><p><b>From: </b>{vacation.startDate}<b> To: </b>{vacation.endDate}</p></div>

                                </div>
                            </div>)}
                    </div>

                    {this.isShown && <h1 id="notFoundMessage"> Not Found!</h1>}
                </div>
                {this.state.isModalOpen && <Modal open={this.state.isModalOpen} content={this.modalContent} />}

            </div >
        );
    }
}