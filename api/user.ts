import { SigninRequest, SigninResponse } from "../type/user/signin.type";
import { SignupRequest } from "../type/user/signup.type";
import StartHubAxios from "../lib/StartHubAxios";
import { Response } from "../type/util/response.type";
import { GetMeResponse, GetUserResponse } from "../type/user/user.type";
import { SetProfileRequest } from "../type/user/profile.type";

const GET_TOKEN_API_HEADERS = {'X-Platform': 'app'}

export const signup = async (signupData : SignupRequest) : Promise<Response> =>
    (await StartHubAxios.post('/user/sign-up', signupData)).data

export const signin = async (signinData : SigninRequest) : Promise<SigninResponse> => 
    (await StartHubAxios.post(
        '/user/sign-in', 
        signinData, 
        { headers : GET_TOKEN_API_HEADERS }
    )).data

export const setProfile = async (setProfileData: SetProfileRequest): Promise<Response> =>
    (await StartHubAxios.patch('/user/profile', setProfileData)).data;

export const getMe = async () : Promise<GetMeResponse> => 
    (await StartHubAxios.get('/user/me')).data

export const getUser = async (userId : number) : Promise<GetUserResponse> => 
    (await StartHubAxios.get(`/user/${userId}/profile`)).data

export const deleteUser = async(deleteUserData : {password ?: string}) : Promise<Response> => 
    (await StartHubAxios.delete('/user', {data : deleteUserData})).data