import { atom } from "recoil";
import { Session } from "../utils/auth";


export type Server = {
	id: string,
	title: string,
	fhirUri: string,
	authConfig: {
		authUri: string,
		tokenUri: string,
		clientId: string
	},
	session?: Session,
	lastUpdated?: string
}

export type Servers = { [id: string]: Server }


export const serversState = atom<Servers>({
	key: "servers",
	default: {}
});
