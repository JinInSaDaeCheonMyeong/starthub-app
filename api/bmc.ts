import {ChatRoomResponse} from "../type/chat/room.type";
import StartHubAxios from "../lib/StartHubAxios";
import {BMCType, GetBMCsResponse} from "../type/BMC/BMC.type";

export const getBMCs = async () : Promise<GetBMCsResponse> =>
    (await StartHubAxios.get('bmc/canvases')).data