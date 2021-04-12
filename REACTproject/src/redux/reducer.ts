import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";
import axios from "axios";

// This function is NOT called direcrtly by you
export function reduce(oldAppState: AppState, action: Action): AppState {
    // Cloning the oldState (creating a copy)
    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.Login:
            newAppState.isLoginned = action.payload;

            break;

        case ActionType.Register:
            newAppState.userLoginDetails = action.payload;
            break;

        case ActionType.GetUserDataFromSessionStorage:
            newAppState.userData = JSON.parse(sessionStorage.getItem("storedUserData"));

            if (newAppState.userData) {
                axios.defaults.headers.common["Authorization"] =
                    "Bearer " + newAppState.userData.token;
            }
            break;

        case ActionType.GetAllVacations:
            newAppState.allVacations = action.payload;
            break;

        case ActionType.GetAllDestinations:
            newAppState.allDestinations = action.payload;
            break;

        case ActionType.SetButtonActionState:
            newAppState.buttonActionState = action.payload;
            break;

        case ActionType.GetEdittedVacation:
            newAppState.underEdittedVacation = action.payload;
            break;

        case ActionType.GetAllFollowingVacations:
            newAppState.allFollowingVacations = action.payload;
            break;

    }

    // After returning the new state, it's being published to all subscribers
    // Each component will render itself based on the new state
    return newAppState;
}