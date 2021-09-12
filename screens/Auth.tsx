import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback, Button, ActivityIndicator } from "react-native";
import { AuthRequestConfig, DiscoveryDocument, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useRecoilState } from "recoil";
import { Server, serversState } from "../recoil/servers";
import { exchangeAuthCode } from "../utils/auth";
import { timeout } from "../utils";
import { ClusterWithArrows, Success, Error } from "../components/Icons";


const useProxy = true;
const redirectUri = makeRedirectUri({ useProxy });

const scopes = ["launch/patient", "patient/*.*", "offline_access"];
const unstuckScopes = scopes.filter(s => s !== "launch/patient");


const Auth = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, "Auth">) => {
	const [servers, setServers] = useRecoilState(serversState);
	const theServer = servers[route.params.serverId];
	const done = (newState: Server) => {
		setServers(oldValue => ({
			...oldValue,
			[route.params.serverId]: newState
		}));
		navigation.goBack();
	};

	return theServer ? <ServerAuth server={theServer} onDone={done} goBack={() => navigation.goBack()} /> : <></>;
};


const ServerAuth = ({ server, onDone, goBack }: { server: Server, onDone: (s: Server) => void, goBack: () => void }) => {
	const config: AuthRequestConfig = {
		clientId: server.authConfig.clientId,
		redirectUri,
		scopes,
		extraParams: {
			aud: server.fhirUri
		}
	};
	const discovery: DiscoveryDocument = {
		authorizationEndpoint: server.authConfig.authUri,
		tokenEndpoint: server.authConfig.tokenUri
	};

	const [request, response, promptAsync] = useAuthRequest(config, discovery);

	const unstuckConfig = { ...config, scopes: unstuckScopes };
	const [_1, _2, promptAsyncUnstuck] = useAuthRequest(unstuckConfig, discovery);

	type Phase = "init" | "prompt" | "exchange" | "done" | "error"
	const [phase, setPhase] = useState<Phase>("init");

	const [err, setErr] = useState("")

	const go = (clicks: number) => async () => {
		const prompt = (clicks < 7 ? promptAsync : promptAsyncUnstuck);
		setPhase("prompt");
		const result = await prompt({ useProxy });
		if (result.type === "success" && result.params.code) {
			setPhase("exchange");
			const session = await exchangeAuthCode({
				clientId: server.authConfig.clientId,
				tokenUri: server.authConfig.tokenUri,
				redirectUri,
				codeVerifier: request?.codeVerifier,
				code: result.params.code
			});
			setPhase("done");
			await timeout(500);
			const newServerState: Server = {
				...server,
				session
			};
			onDone(newServerState);
		} else {
			setPhase("error");
		}
	}


	if (phase === "prompt" || phase === "exchange") {
		return <View style={{
			flex: 1,
			alignItems: "center",
			justifyContent: "center"
		}}>
			<ActivityIndicator color="#0069ff" size="large" />
		</View>
	}

	if (phase === "done") {
		return <View style={{
			flex: 1,
			alignItems: "center",
			justifyContent: "center"
		}}>
			<Success />
		</View>
	}

	return (
		<InvisibleClickCounter>
			{clicks => (
				<View style={{
					flex: 1,
					justifyContent: "center",
					padding: 20
				}}>
					<Text style={{
						fontSize: 24
					}}>
						{ phase === "error" ? "Authorization failed" : "Configure Access to Data" }
					</Text>
					<Text style={{
						fontSize: 16,
						marginTop: 30,
						textAlign: "justify"
					}}>
						{phase === "error" ? `Please try again to enter the data provided by the ${ server.title } organization to authorize with the server.` : "To configure app's access to the provider's server, use your user name and password that you got from your provider." }
					</Text>
					<View style={{
						alignSelf: "center",
						marginTop: 50
					}}>
						{phase === "error" ? <Error /> : <ClusterWithArrows />}
					</View>
					<View style={{
						position: "absolute",
						bottom: 80,
						left: 20,
						right: 20
					}}>
						<Button
							title={clicks < 7 ? "Authorize With The Server" : "Initiate unstuck sequence"}
							onPress={go(clicks)}
						/>
						{ phase === "error" ? <Button
							title="Cancel"
							onPress={goBack}
						/> : null }
					</View>
				</View>
			)}
		</InvisibleClickCounter>
	);
};


const InvisibleClickCounter = ({ children }: { children: (n: number) => JSX.Element }) => {
	const [clickN, setClickN] = useState(0);
	return (
		<TouchableWithoutFeedback
			onPress={() => setClickN(n => n+1)}
		>
			{children(clickN)}
		</TouchableWithoutFeedback>
	);
}


export default Auth;
