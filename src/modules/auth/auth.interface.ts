import { UserRole, UserStatus } from "../../../generated/prisma/enums"

export interface ICreatUser {
    name: string,
    email: string,
    password: string,
    role?: UserRole
    status?: UserStatus,
    phone?: string,
    profileImage?: string,
}

export interface ILoginUser {
    email: string,
    password: string,
}