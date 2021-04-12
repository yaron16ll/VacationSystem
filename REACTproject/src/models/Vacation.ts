export class Vacation {
    public constructor(
        public id?: number,
        public description?: string,
        public city?: string,
        public picture?: string,
        public startDate?: string,
        public endDate?: string,
        public followings_amount?: number,
        public destinationName?: string,

        public destinationId?: number,
        public price?: number,
        public isFollowing?: boolean
    ) { }

}