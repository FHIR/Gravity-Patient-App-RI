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
		if (!session.access.expiresAt || session.access.expiresAt > Date.now()) {
			return cb(session.access.token, session.patientId, server.fhirUri);
		}
		const { refresh } = session;
		if (refresh) {
			const newSession = await refreshAccessToken({ refreshToken: refresh.token, ...server.authConfig })
			setServers(old => ({
				...old,
				[serverId]: { ...server, session: newSession }
			}));
			return cb(newSession.access.token, session.patientId, server.fhirUri);
		}
		cb(session.access.token, session.patientId, server.fhirUri);
	}
	return withAccessToken;
};