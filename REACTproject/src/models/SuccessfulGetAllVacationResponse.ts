import { Vacation } from "./Vacation";

export class SuccessfulGetAllVacationResponse {
    public constructor(
        public allVacations?: Vacation[],
        public allMyFollowedVacations?: number[]
    ) { }

}