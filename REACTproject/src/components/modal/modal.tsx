import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Component } from 'react';
import "./modal.css";

//Declare state variables (state - model,a box of data that each component maintains).
//Every change or update of the state,there's a call to render function(the component is re-rendered)
interface ModalState {
    open: boolean
}

//The class inherits the functionality of Component class
export default class Modal extends Component<any, ModalState>{
    //Initalize Props object, State object, class variables.
    public constructor(props: any) {
        // Calling the constructor of Component, supplying props as a parameter
        super(props);
        this.state = {
            open: true
        };
    }


    //Callback in life cycle hooks of the component (where the component is initalized)
    public componentDidMount() {

        console.log(this.props.content)
    }


//callback,trrggered when hte user close the modal
    private handleClose = () => {
        this.setState({ open: false })
    };




    //Html Code
    public render() {
        return (
            <div id="modal">
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >

                    <DialogTitle id="alert-dialog-title">Error!</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">{this.props.content}</DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Close </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}