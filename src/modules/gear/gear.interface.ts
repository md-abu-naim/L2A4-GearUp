import { GearStatus } from "../../../generated/prisma/enums.js";

export interface IQuery {
    search?:string,
    category?: string,
    brand?: string,
    availability?: GearStatus,
    minPrice?: number
    maxPrice?: number
}