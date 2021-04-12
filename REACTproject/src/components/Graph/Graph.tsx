import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import { store } from '../../redux/store';
import "./Graph.css"
import axios from "axios";
import { FollowingVacation } from '../../models/FollowingVacation';
import config from '../../config';
import { ActionType } from '../../redux/action-type';
import Modal from '../modal/modal';

//Declare state variables (state - model,a box of data that each component maintains).
//Every change or update of the state,there's a call to render function(the component is re-rendered)
interface GraphState {
    labels: string[],
    datasets: any[],
    allFollowingVacations: FollowingVacation[],
    isModalOpen: boolean
}
//The class inherits the functionality of Component class
export default class Graph extends Component<any, GraphState>{
    //Declare class variables
    private unsubscribeStore: any;
    private modalContent: string

    //Initalize Props object, State object, class variables.
    public constructor(props: any) {
        super(props);
        this.state = {
            labels: [],
            datasets: [],
            allFollowingVacations: [],
            isModalOpen: false
        };
        this.modalContent = ""

        this.unsubscribeStore = store.subscribe(
            //  the following function is our "listener", "refresh function"
            () => this.setState(
                {
                    allFollowingVacations: store.getState().allFollowingVacations
                })
        );
    }


    //Callback in life cycle hooks of the component (where the component is destroyed)
    public componentWillUnmount() {
        this.unsubscribeStore();
    }


    //Callback in life cycle hooks of the component (where the component is initalized)
    public async componentDidMount() {
        await this.retrieveAllFollowingVacations()
        let amounts = this.getAmountsFromFollowingVacations()
        let vacationIds = this.getIdsFromFollowingVacations()
        this.createGraph(amounts, vacationIds);
    }


    //retrieves all following vacations
    private async retrieveAllFollowingVacations() {
        if (store.getState().allFollowingVacations === null || store.getState().allFollowingVacations.length === 0) {
            try {
                this.setState({ isModalOpen: false })
                let response = await axios.get<FollowingVacation[]>(`${config.domain}/vacations/allFollowedVacations`);
                store.dispatch({ type: ActionType.GetAllFollowingVacations, payload: response.data });
            }
            catch (err) {
                this.modalContent = err.response.data.error;
                this.setState({ isModalOpen: true })
            }
        }
        else {
            this.setState({ allFollowingVacations: store.getState().allFollowingVacations })
        }
        console.log(this.state.allFollowingVacations, "following vacations")
    }


    //gets all amounts of following vacations
    private getAmountsFromFollowingVacations(): number[] {
        let amounts = [];
        for (let FollowingVacation of store.getState().allFollowingVacations) {
            amounts.push(FollowingVacation.followings_amount)
        }

        console.log(amounts, "amounts")
        return amounts;
    }



    //gets all ids of following vacations
    private getIdsFromFollowingVacations(): string[] {
        let ids = [];
        for (let FollowingVacation of store.getState().allFollowingVacations) {
            ids.push(`Vacation No. ${FollowingVacation.id}`)
        }

        console.log(ids, "ids")
        return ids;
    }



    //creates a graph
    private createGraph(amounts: number[], vacationsIds: string[]) {
        this.setState({
            labels: vacationsIds, datasets: [{
                label: 'Amount of Followings',
                backgroundColor: 'rgba(255, 128, 170,0.6)',
                borderColor: 'rgba(255, 77, 136)',
                borderWidth: 2,
                data: amounts
            }]
        });
    }


    //callback return us to the pervious component
    private onBackClick = () => {
        this.props.history.push('/vacations')
    }









    //Html Code
    public render() {
        return (
            <div id="graph">
   <button type="button" id="graphBackButton" className="btn btn-primary" onClick={this.onBackClick} name="back">Back</button>
                <Bar
                    data={this.state}
                    options={{

                        title: {
                            display: true,
                            text: 'All Following Vacations Graph',
                            fontSize: 30
                        },
                        legend: {
                            display: true,
                            position: 'right'

                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 3,
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Amount of Followings',
                                    fontSize: 20

                                }
                            },],

                            xAxes: [
                                {
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'All Following Vacations',
                                        fontSize: 20

                                    }
                                }]
                        }
                    }}
                />
             
                {this.state.isModalOpen && <Modal open={this.state.isModalOpen} content={this.modalContent} />}

            </div>
        );
    }
}