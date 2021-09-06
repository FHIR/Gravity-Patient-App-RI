import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useRecoilState } from "recoil";
import { Server, serversState } from "../recoil/servers";
import { HStack, VStack, Text, Button } from "native-base";
import Card from "../components/Card";
import { refreshAccessToken } from "../utils/auth";


const ServerView = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, "ServerView">) => {
	const [servers] = useRecoilState(serversState);
	const theServer = servers[route.params.serverId];

	const serverTitle = theServer?.title || "";
	useEffect(() => {
		navigation.setOptions({ title: serverTitle });
	}, [serverTitle]);

	return (
		theServer ? TheServerView(theServer) : <></>
	);
}


const TheServerView = (server: Server) => {

	return (
		<>
			<VStack p={5} space={10}>
				<Card>
					<VStack space={5}>
						<VStack space={2}>
							<Text>Organization Name:</Text>
							<Text>{server.title}</Text>
						</VStack>

						<VStack space={2}>
							<Text>Server URI:</Text>
							<Text numberOfLines={1}>{server.fhirUri}</Text>
						</VStack>
					</VStack>
				</Card>

				<HStack space={5}>
					<Button flex={1}>Delete</Button>
					<Button flex={1} disabled={true}>Save Changes</Button>
				</HStack>
			</VStack>

			<SessionStatus server={server} />
		</>
	);
}


const SessionStatus = ({ server }: { server: Server }) => {
	const [servers, setServers] = useRecoilState(serversState);
	const { session } = server;

	const refresh = (refreshToken: string) => async () => {
		const newSession = await refreshAccessToken({
			clientId: server.authConfig.clientId,
			tokenUri: server.authConfig.tokenUri,
			refreshToken
		});
		setServers(oldServers => ({
			...oldServers,
			[server.id]: { ...server, session: newSession }
		}));
	};
	
	return session ? (
		<Card flex={1}>
			<VStack space={5}>
				<VStack space={2}>
					<Text numberOfLines={1}>access token: {session.access.token}</Text>
					<HStack space={5} alignItems="center">
						<Text numberOfLines={1}>
							<ExpirationStatus expiresAt={session.access.expiresAt} />
						</Text>
						{session.refresh ?
							<Button size="xs" onPress={refresh(session.refresh.token)}>Refresh</Button>
							:
							<></>
						}
					</HStack>
				</VStack>
				<VStack space={2}>
					<Text numberOfLines={1}>refresh token: {session.refresh?.token || "-"}</Text>
					{session.refresh ?
						<Text numberOfLines={1}>
							<ExpirationStatus expiresAt={session.refresh.expiresAt} />
						</Text>
						:
						<></>
					}
				</VStack>
			</VStack>
		</Card>
	) : (
		<Text>Not authorized</Text>
	);
}


const ExpirationStatus = ({ expiresAt }: { expiresAt?: number }) => {
	const now = useUnixTime();

	if (!expiresAt) {
		return <Text>expires in: unknown</Text>
	}

	if (now > expiresAt) {
		return <Text>expired</Text>
	}
	
	return <Text>expires in {Math.round((expiresAt-now)/1000)}s</Text>
}


const useUnixTime = (): number => {
	const [now, setNow] = useState(Date.now());
	useEffect(() => {
		const intervalId = setInterval(
			() => setNow(Date.now()),
			1000
		);
		return () => clearInterval(intervalId);
	}, []);
	return now;
}


export default ServerView;