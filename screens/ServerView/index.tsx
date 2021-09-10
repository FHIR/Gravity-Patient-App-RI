import React, {useEffect, useRef, useState} from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useRecoilState } from "recoil";
import { Server, serversState } from "../../recoil/servers";
import {HStack, VStack, Text, Button, FormControl, Input, ScrollView} from "native-base";
import Card from "../../components/Card";
import { refreshAccessToken } from "../../utils/auth";
import ServerViewSync from "../ServerView/ServerViewSync"
import ServerViewToken from "../ServerView/ServerViewToken"
import DeleteServerModalWindow from "./DeleteServerModalWindow";

const ServerView = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, "ServerView">) => {
	const [servers] = useRecoilState(serversState);
	const theServer = servers[route.params.serverId];

	const serverTitle = theServer?.title || "";
	useEffect(() => {
		navigation.setOptions({ title: serverTitle });
	}, [serverTitle]);

	return (
		theServer ? <TheServerView server={theServer} /> : <></>
	);
}


const TheServerView = ({ server }: { server: Server }) => {
	const [serverTitle, setServerTitle] = useState(server.title);
	const [fhirUri, setFhirUri] = useState(server.fhirUri);
	const [servers, setServers] = useRecoilState(serversState);
	const [currentServer, setCurrentServer] = useState();
	const [showModal, setShowModal] = useState(false)

	const prevTitleRef = useRef();
	const prevUriRef = useRef();

	useEffect(() => {
		prevTitleRef.current = serverTitle;
		prevUriRef.current = fhirUri;
		setCurrentServer(servers[server.id]);
	})

	const prevServerTitle = prevTitleRef.current;
	const prevFhirUri= prevUriRef.current;

	const saveServerChanges = () => {
		const updatedServer: Server = {
			...currentServer,
			title: serverTitle,
			fhirUri: fhirUri
		};
		setServers(oldServers => ({
			...oldServers,
			[server.id]: updatedServer
		}));
	}

	return (
		<ScrollView>
			<Card m={"20px"}>
				<VStack space="lg">
					<FormControl>
						<FormControl.Label _text={{color: "#7B7F87", fontSize: 14, fontWeight: 400}}>
							Organization Name:
						</FormControl.Label>
						<Input
							value={serverTitle}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							onChangeText={title => setServerTitle(title)}
						/>
					</FormControl>
					<FormControl>
						<FormControl.Label _text={{color: "#7B7F87", fontSize: 14, fontWeight: 400}}>
							Server URI:
						</FormControl.Label>
						<Input
							value={fhirUri}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							onChangeText={uri => setFhirUri(uri)}
						/>
					</FormControl>
					<ServerViewSync />
					<ServerViewToken />
					{/*<SessionStatus server={server} />*/}
				</VStack>
			</Card>
			<HStack  justifyContent="space-between" m="20px">
				<Button
					onPress={ () => setShowModal(!showModal)}
					bg="#f8f9fb"
					border={1}
					borderColor="#7b7f87"
					_pressed={{
						backgroundColor: "#0069FF",
						_text: {
							color: "#fff"
						}}}
					w={"47%"}
					_text={{ color:"#2d2d2d", fontSize: 14, fontWeight: 400 }}
				>
					Delete
				</Button>
				<Button
					disabled={prevServerTitle === serverTitle && prevFhirUri === fhirUri}
					onPress={saveServerChanges}
					w={"47%"}
					bg="#f8f9fb"
					border={1}
					borderColor="#7b7f87"
					_pressed={{
						backgroundColor: "#0069FF",
						_text: {
							color: "#fff"
						}}}
					_text={{ fontSize: 14, fontWeight: 400 }}
				>
					Save Changes
				</Button>
			</HStack>
			<DeleteServerModalWindow server={server} isVisible={showModal} closeModal={ () => setShowModal(false) } />
		</ScrollView>
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
