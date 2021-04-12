import React, { Component } from 'react'
import { ChangeEvent } from 'react';
import "./AddVacation.css"
import DatePicker from "react-datepicker";
import { store } from '../../redux/store';
import { Destination } from '../../models/Destination';
import axios from "axios";
import config from '../../config';
import { ActionType } from '../../redux/action-type';
import "react-datepicker/dist/react-datepicker.css";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Vacation } from '../../models/Vacation';
import Modal from '../modal/modal';

//Declare state variables (state - model,a box of data that each component maintains).
//Every change or update of the state,there's a call to render function(the component is re-rendered)
interface AddVacationState {
    price: string,
    description: string,
    city: string,
    startDate: Date,
    endDate: Date,
    destinationId: number,
    preview: string,
    allDestinations: Destination[],
    image: string,
    isModalOpen: boolean
}
//The class inherits the functionality of Component class
export default class AddVacation extends Component<any, AddVacationState>{
    //Declare class variables
    private priceRegex: RegExp;
    private citytRegex: RegExp;
    private minDate: Date;
    private unsubscribeStore: any;
    private fileInput: HTMLInputElement;
    private modalContent: string;

    //Initalize Props object, State object, class variables.
    public constructor(props: any) {
        super(props);
        this.state = {
            price: '',
            description: '',
            city: '',
            startDate: null,
            endDate: null,
            destinationId: 0,
            preview: "/pics/default.jpg",
            allDestinations: [],
            image: "",
            isModalOpen: false

        };

        this.priceRegex = /^(\$?\d{1,3}(?:,?\d{3})?(?:\.\d{1,2})?|\.\d{2})?$/;
        this.citytRegex = /^[a-zA-Z-\s]+$/;
        this.modalContent = "";
        this.minDate = new Date()

        this.unsubscribeStore = store.subscribe(
            //  the following function is our "listener", "refresh function"
            () => this.setState(
                {
                    allDestinations: store.getState().allDestinations
                })
        );
    }


    //Callback in life cycle hooks of the component (where the component is destroyed)
    public componentWillUnmount() {
        this.unsubscribeStore();
    }



    //Callback in life cycle hooks of the component (where the component is initalized)
    public async componentDidMount() {
        this.checkActionState()
        if (store.getState().allDestinations === null || store.getState().allDestinations.length === 0) {
            try {
                this.setState({ isModalOpen: false })
                let response = await axios.get<Destination[]>(`${config.domain}/destinations/all`);
                store.dispatch({ type: ActionType.GetAllDestinations, payload: response.data });
            }
            catch (err) {
                this.modalContent = err.response.data.error;
                this.setState({ isModalOpen: true })
            }
        }
        else {
            this.setState({ allDestinations: store.getState().allDestinations })
        }
    }


    //checks the state of the action(adding or updating a vactation)
    private checkActionState() {

        let actionState = store.getState().buttonActionState
        if (actionState === "editing") {
            this.setStateByVacationDetails();
        }
    }


    private setStateByVacationDetails() {

        let edittedVacation = store.getState().underEdittedVacation

        this.setState({
            price: edittedVacation.price + "",
            preview: `http://localhost:3000/uploads/${edittedVacation.picture}`,
            description: edittedVacation.description,
            destinationId: edittedVacation.destinationId,
            city: edittedVacation.city,
            startDate: new Date(edittedVacation.startDate),
            endDate: new Date(edittedVacation.endDate),
            image: edittedVacation.picture
        })
    }


    //sets a price
    private setPrice = (args: ChangeEvent<HTMLInputElement>) => {
        const price = args.target.value;
        this.setState({ price: price });
    }


    //sets a description
    private setDescription = (event: any) => {
        const description = event.target.value;
        this.setState({ description });
    }


    //sets  a city
    private setCity = (args: ChangeEvent<HTMLInputElement>) => {
        const city = args.target.value;
        this.setState({ city });
    }


    //sets a start date
    private setStartDate = (date: Date) => {
        this.setState({
            startDate: date
        });
    };


    //sets an end date
    private setEndDate = (date: Date) => {
        this.setState({
            endDate: date
        });
    };

    //sets a destination
    private setDestination = (args: ChangeEvent<HTMLSelectElement>) => {
        this.setState({ destinationId: +args.target.value });
    };


    //sets a picture
    private setPicture = (args: ChangeEvent<HTMLInputElement>) => {
        // Extracting the selected file date (textual info)
        const selectedPicture = args.target.files[0];

        if (selectedPicture !== undefined && selectedPicture !== null) {

            // Display image on client: 
            let reader = new FileReader();

            // Initializing the "onload" event of the reader object
            // Meaning : AFTER the picture is selected, the preview field 
            // will be refreshed, and will display the picture
            reader.onload = event => this.setState({ preview: event.target.result.toString() });

            // Read the file data (image binary), into the image field
            reader.readAsDataURL(selectedPicture);

            console.log(typeof args.target.files[0])
            // const myFormData = new FormData();
            // myFormData.append("image", this.state.picture, this.state.picture.name)
            this.uploadImage(selectedPicture)
        }
    }


    //uploads an image
    private async uploadImage(selectedPicture: File) {
        const myFormData = new FormData();
        myFormData.append("image", selectedPicture, selectedPicture.name)

        console.log(myFormData.get("image"))
        try {
            this.setState({ isModalOpen: false })
            let response = await axios.post<any>(`${config.domain}/vacations/uploadImageFile`, myFormData);
            this.setState({ image: response.data })
            console.log(response.data)
        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })
        }

    }

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

        return [year, month, day].join('-');
    }


    //checks if the input fields are valid
    private areInputFieldsValidate = () => {
        if (this.citytRegex.test(this.state.city) && this.priceRegex.test(this.state.price)) {
            return true;
        }
        return false
    }


    //callback which sends us back to the pervious component
    private onBackClicked = () => {
        this.props.history.push('/vacations')

    }


    //Callback saves the changes 
    private onSaveVacationClicked = () => {
        this.saveVacation()
        this.initState()

    }

    //Initalizes state 
    private initState() {
        this.setState({
            price: '',
            description: '',
            city: '',
            startDate: null,
            endDate: null,
            destinationId: 0,
            preview: "/pics/default.jpg"
        });
    }

    //saves changes of vacation
    private saveVacation() {

        if (store.getState().buttonActionState === "adding") {
            console.log("adding")
            this.addVacation()
        }
        else {
            console.log("editing")
            this.editVacation()
        }
    }


    //adds a new vacation
    private async addVacation() {
        try {
            this.setState({ isModalOpen: false })
            let underEdittedVacation = this.createUnderEdittedVacation()
            console.log(underEdittedVacation)
            let response = await axios.post<Vacation[]>(`${config.domain}/vacations`, underEdittedVacation);
            console.log(response.data)
            store.dispatch({ type: ActionType.GetAllVacations, payload: response.data });


        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })
        }
    }


    //creates  under editted vacation object
    private createUnderEdittedVacation(): Vacation {
        let underEdittedVacation = new Vacation();

        underEdittedVacation.city = this.state.city;
        underEdittedVacation.description = this.state.description;
        underEdittedVacation.destinationId = this.state.destinationId;
        underEdittedVacation.picture = this.state.image;
        underEdittedVacation.price = +this.state.price;
        underEdittedVacation.startDate = this.formatDate(this.state.startDate);
        underEdittedVacation.endDate = this.formatDate(this.state.endDate);
        return underEdittedVacation;
    }


    //edits a vacation
    private async editVacation() {
        let edittedVacation = store.getState().underEdittedVacation
        let newUnderEdittedVacation = this.createUnderEdittedVacation()
        newUnderEdittedVacation.id = edittedVacation.id
        console.log(newUnderEdittedVacation)

        try {
            this.setState({ isModalOpen: false })
            await axios.put<void>(`${config.domain}/vacations`, newUnderEdittedVacation);
            this.setTheExistVacaationDetails(newUnderEdittedVacation);
            this.props.history.push('/vacations')

        }
        catch (err) {
            this.modalContent = err.response.data.error;
            this.setState({ isModalOpen: true })
        }
    }


    //sets the exist vacation details
    private setTheExistVacaationDetails(underEdittedVacation: Vacation) {
        let allVacations = store.getState().allVacations;

        allVacations.forEach((vacation, index, vacations) => {
            if (underEdittedVacation.id === vacation.id) {
                console.log("here")
                this.updateExistingVacationInArray(underEdittedVacation, index, vacations)
            }
        })
        console.log(allVacations)
        store.dispatch({ type: ActionType.GetAllVacations, payload: allVacations });
    }


    //updates an editted vacation in vacations array
    private updateExistingVacationInArray(underEdittedVacation: Vacation, index: number, vacations: Vacation[]) {
        vacations[index].city = underEdittedVacation.city
        vacations[index].description = underEdittedVacation.description
        vacations[index].destinationName = this.getDestinaionName(underEdittedVacation.destinationId, vacations)
        vacations[index].price = underEdittedVacation.price
        vacations[index].destinationId = underEdittedVacation.destinationId
        console.log(vacations[index].destinationName)
        vacations[index].picture = underEdittedVacation.picture
        vacations[index].startDate = this.formatStringDate(underEdittedVacation.startDate)
        vacations[index].endDate = this.formatStringDate(underEdittedVacation.endDate)

    }

    //formats  a string date 
    private formatStringDate(stringDate: string): string {
        let [dd, mm, yyyy] = stringDate.split("-");
        return `${mm}/${yyyy}/${dd}`;
    }


    //gets destination name
    private getDestinaionName(destinationId: number, vacations: Vacation[]): string {
        console.log(destinationId)
        for (let vacation of vacations) {
            if (vacation.destinationId === destinationId) {
                console.log("here")
                console.log(vacation.destinationName)

                return vacation.destinationName

            }
        }
    }







    //Html Code
    public render() {
        return (
            <div className="AddVacation" >
                <div className="container">
                    <h1>{store.getState().buttonActionState === "adding" ? 'Add Vacation' : 'Update Vacation'}</h1><br />
                    <div className="row">

                        <div className="col-sm-6" >

                            <div className="form-group">
                                <input type="text" className="form-control" value={this.state.price} onChange={this.setPrice} id="price" placeholder="Insert a Price..." name="price" />
                                {this.state.price === "" && <span>Please fill out this field</span>}
                                {this.state.price !== "" && !this.priceRegex.test(this.state.price) && <span>Insert Valid Price.</span>}
                            </div>

                            <div className="form-group">
                                <textarea className="form-control" cols={60} rows={3} maxLength={100} id="description" placeholder="Insert a Description..." onChange={this.setDescription} name="description" value={this.state.description}></textarea>
                                {this.state.description === "" && <span>Please fill out this field</span>}

                            </div>

                            <div className="form-group">
                                <select placeholder="Select Option" className="form-control" value={this.state.destinationId} name="destinations" onChange={this.setDestination}
                                >
                                    <option hidden value="default">Select a Destination</option>

                                    {this.state.allDestinations.map((destination) => (
                                        <option value={destination.id} key={destination.id}>
                                            {destination.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control" value={this.state.city} onChange={this.setCity} id="city" placeholder="Insert a City..." name="city" />
                                {this.state.city === "" && <span>Please fill out this field</span>}
                                {this.state.city !== "" && !this.citytRegex.test(this.state.city) && <span>You can insert only letters.</span>}
                            </div>
                        </div>

                        <div className="col-sm-6" >
                            <div className="date">
                                <DatePicker className="form-control"
                                    selected={this.state.startDate}
                                    onChange={this.setStartDate}
                                    minDate={this.minDate}
                                    selectsStart

                                    placeholderText="Select a start date..."
                                /></div>
                            <div className="date">
                                <DatePicker className="form-control "
                                    selected={this.state.endDate}
                                    onChange={this.setEndDate}
                                    selectsEnd
                                    minDate={this.state.startDate}
                                    placeholderText="Select an end date..."
                                /></div>

                            <div className="form-group" id="up">
                                <input type="file" onChange={this.setPicture} accept="image/*" ref={fi => this.fileInput = fi} />

                                <button className="text-danger" type="button" onClick={() => this.fileInput.click()}><ArrowDownwardIcon></ArrowDownwardIcon></button>
                                <img src={this.state.preview} alt="vacation" />

                            </div>

                        </div>

                        <div className="row" id="btns">

                            <div className="col-sm-12" >

                                <div className="form-group" >
                                    <button type="submit" className="btn btn-primary" disabled={!(this.state.city && this.state.description && this.state.destinationId && this.state.startDate && this.state.endDate && this.state.image !== "" && this.areInputFieldsValidate())} onClick={this.onSaveVacationClicked}>Save</button>

                                    <button type="button" className="btn btn-primary" onClick={this.onBackClicked} >back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isModalOpen && <Modal open={this.state.isModalOpen} content={this.modalContent} />}
            </div >
        );
    }
}