import { Request, Response, Router } from "express";
import { generalUserInfo, randomAccount } from "../../infrastructure/repositories/userRepository";
import { serverError } from "../../util/helper";
import { ServiceResponse } from "../../util/interfaces";

const userRoutes = Router();


userRoutes.get("/random-account", async(req:Request, res:Response)=>{
    try{
        const { userId }: { userId: string } = res.locals.jwtData;
        const response : ServiceResponse = await randomAccount(userId);
        res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    }catch(error){
    return serverError(res, error);
    }
})


userRoutes.get("/general-user-info/:id", async(req:Request, res:Response)=>{
    try{
        const { id } = req.params;
        const response : ServiceResponse = await generalUserInfo(id);
        res
        .status(response.statusCode)
        .json({ msg: response.message, data: response.data });
    }catch(error){
    return serverError(res, error);
    }
})




export default userRoutes;