import StartHubAxios from "../lib/StartHubAxios";
import { CompetitorRequest, CompetitorResponse, GetCompetitorsResponse } from "../type/competitor/competitor.type";

const COMPETITOR_ENDPOINT = 'analysis/competitors'

export const competitorAnalysis = async (
    data : CompetitorRequest
) : Promise<CompetitorResponse> => 
    (await StartHubAxios.post(COMPETITOR_ENDPOINT, data)).data;

export const getCompetitors = async () : Promise<GetCompetitorsResponse>=> 
    (await StartHubAxios.get(COMPETITOR_ENDPOINT)).data;
