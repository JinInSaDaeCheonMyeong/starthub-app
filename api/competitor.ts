import StartHubAxios from "../lib/StartHubAxios";
import { CompetitorRequest, CompetitorResponse } from "../type/competitor/competitor.type";

export const competitorAnalysis = async (
    data : CompetitorRequest
) : Promise<CompetitorResponse> => 
    (await StartHubAxios.post('analysis/competitors', data)).data
