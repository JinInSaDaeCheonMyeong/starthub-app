import { SendcodeRequest } from "../type/email/sendcode.type";
import { VerifyRequest } from "../type/email/verify.type";
import { Response } from "../type/util/response.type";
import StartHubAxios from "../lib/StartHubAxios";

export const verify = async (verifyData : VerifyRequest) : Promise<Response> => 
    (await StartHubAxios.post('/email/verify', verifyData)).data

export const sendcode = async (sendcodeData : SendcodeRequest) : Promise<Response> => 
    (await StartHubAxios.post('/email/send-code', sendcodeData)).data
