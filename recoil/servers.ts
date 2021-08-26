import { atom } from "recoil";


export type Server = {
    title: string,
    fhirUri: string,
    authConfig: {
        authUri: string,
        tokenUri: string,
        clientId: string
    },
    session: {
        patientId: string,
        token: {
            access: string | null
        }
    } | null
}

type Servers = { [id: string]: Server | undefined }


export const serversState = atom<Servers>({
    key: "servers",
    default: {}
});