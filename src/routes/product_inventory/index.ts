import {Router} from "express"
import CustomError from "../../errors/CustomError"
import { ErrorCode, ErrorType } from "../../errors/types"

const router = Router()

router.use("/product-category", ()=> {
    throw new CustomError({errorCode: ErrorCode.BAD_REQUEST, errorType: ErrorType.BAD_REQUEST, message: "BAD_REQUEST", property: 'hello'})
})

export default router