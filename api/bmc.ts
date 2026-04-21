import StartHubAxios from "../lib/StartHubAxios";
import {GetBMCResponse, GetBMCsResponse} from "../type/BMC/BMC.type";

export const getBMCs = async () : Promise<GetBMCsResponse> =>
    (await StartHubAxios.get('bmc/canvases')).data

export const getBMC = async (id: number): Promise<GetBMCResponse> =>
    (await StartHubAxios.get(`bmc/canvases/${id}`)).data;
