import { atom, useRecoilState } from "recoil";
import { refreshAccessToken, Session } from "../utils/auth";


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


export const useWithAccessToken = () => {
	const [servers, setServers] = useRecoilState(serversState);
	const withAccessToken = async (serverId: string, cb: (token: string, patientId: string, fhirUri: string) => void) => {
		const server = servers[serverId];
		const session = server?.session;
		if (!server || !session) {
			return;
		}
		try {
			await cb(session.access.token, session.patientId, server.fhirUri);
		} catch (err: any) {
			const { refresh } = session;
			if (typeof err === "object" && err?.response?.status === 401 && refresh) {
				const newSession = await refreshAccessToken({ refreshToken: refresh.token, ...server.authConfig })
				setServers(old => ({
					...old,
					[serverId]: { ...server, session: newSession }
				}));
				cb(newSession.access.token, session.patientId, server.fhirUri);
			} else {
				throw err;
			}
		}
	}
	return withAccessToken;
};