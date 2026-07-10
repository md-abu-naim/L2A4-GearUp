import { GearStatus } from "../../../generated/prisma/enums.js"

export interface IGear {
    title: string,
    description?: string,
    brand: string,
    image?: string,
    pricePerDay: number,
    stock?: number,
    category: string
}

export interface IUpdateGear {
    title?: string,
    description?: string,
    brand?: string,
    image?: string,
    pricePerDay?: number,
    stock?: number,
    category?: string,
    status?: GearStatus
}