import express, { Application, Request, Response } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import { authRouters } from "./modules/auth/auth.route.js";
import { adminRouters } from "./modules/admin/admin.route.js";
import { userRouters } from "./modules/user/user.route.js";
import { categoryRouters } from "./modules/category/category.route.js";
import { notFound } from "./middleware/notFound.js";
import { providerRouters } from "./modules/provider/provider.route.js";
import { gearRouters } from "./modules/gear/gear.route.js";
import { rentalRouters } from "./modules/rental/rental.route.js";

const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello. Welcom to my GearUp!')
})

app.use('/api/auth', authRouters)
app.use('/api/users', userRouters)
app.use('/api/categories', categoryRouters)
app.use('/api/gear', gearRouters)
app.use('/api/rentals', rentalRouters)
app.use('/api/provider', providerRouters)
app.use('/api/admin', adminRouters)

app.use(notFound)

export default app