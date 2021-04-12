import { Destination } from "../models/Destination";
import { FollowingVacation } from "../models/FollowingVacation";
import { SuccessfulLoginServerResponse } from "../models/SuccessfulLoginServerResponse";
import { UserLoginDetails } from "../models/UserLoginDetails";
import { Vacation } from "../models/Vacation";

export class AppState {
    public userData: SuccessfulLoginServerResponse = null;
    public userLoginDetails: UserLoginDetails = null;
    public allVacations: Vacation[] = [];
    public isLoginned: boolean = false;
    public allDestinations: Destination[] = [];
    public buttonActionState: string = "adding";
    public underEdittedVacation: Vacation = null;
    public allFollowingVacations: FollowingVacation[] = [];

}