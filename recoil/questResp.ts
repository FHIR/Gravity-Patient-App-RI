import { QuestionnaireResponse } from "fhir/r4";
import { atom } from "recoil";

export const questRespState = atom<{ [serverId: string]: QuestionnaireResponse[] }>({
    key: "questResponseState",
    default: {}
});