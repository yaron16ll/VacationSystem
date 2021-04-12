import React, { Component } from 'react'
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import "./layout.css";
import Header from '../header/header';
import Login from '../login/login';
import { Footer } from '../footer/footer';
import Register from '../register/register';
import Vacations from '../vacations/vacations';
import AddVacation from '../AddVacation/AddVacation';
import Graph from '../Graph/Graph';


export default class Layout extends Component {
    public render() {
        return (
            <BrowserRouter>
                <section id="layout">
                    <header>
                        <Header />
                    </header>

                    <main>
                        {/* Dynamic Component */}
                        <Switch>
                            <Route path="/register" component={Register} exact />
                            <Route path="/home" component={Login} exact />
                            <Route path="/vacations" component={Vacations} exact />
                            <Route path="/addVacation" component={AddVacation} exact />
                            <Route path="/graph" component={Graph} exact />
                            <Redirect from="/" to="/home" exact />
                        </Switch>
                    </main>

                    <footer >
                        <Footer />
                    </footer>


                </section>

            </BrowserRouter >
        );
    }
}