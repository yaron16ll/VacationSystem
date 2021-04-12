export class SuccessfulLoginServerResponse {
    public constructor(
        public token?: string,
        public firstName?: string,
        public lastName?: string,
        public userType?: string
    ) { }

}