import axios from "axios";
import StartHubAxios from "../lib/StartHubAxios";
import { CompetitorRequest, CompetitorResponse, GetCompetitorsResponse } from "../type/competitor/competitor.type";

const COMPETITOR_API_URL = process.env.EXPO_PUBLIC_SUB_API_URL
const COMPETITOR_ENDPOINT = 'analysis/competitors'

export const competitorAnalysis = async (
    data : CompetitorRequest
) : Promise<CompetitorResponse> => 
    (await axios.post(COMPETITOR_API_URL + COMPETITOR_ENDPOINT, data)).data;

export const getCompetitors = async () : Promise<GetCompetitorsResponse>=> 
    (await StartHubAxios.get(COMPETITOR_API_URL + COMPETITOR_ENDPOINT)).data;

export const recompetitorAnalysis = async (id : number) : Promise<CompetitorResponse> => 
    (await StartHubAxios.post(`${COMPETITOR_API_URL}${COMPETITOR_ENDPOINT}/bmc/${id}/regenerate`)).data