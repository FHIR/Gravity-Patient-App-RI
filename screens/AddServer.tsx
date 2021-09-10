import React, { useState } from "react";
import { HStack, VStack, Button, FormControl, Input, Text } from "native-base";
import Card from "../components/Card";
import { useRecoilState } from "recoil";
import { Server, serversState } from "../recoil/servers";
import { discoverAuthEndpoints } from "../utils/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type ParamsFromOutside = {
	title: string,
	fhirUri: string,
	clientId: string
}

const AddServer = (): JSX.Element => {
	const [title, setTitle] = useState("");
	const [fhirUri, setFhirUri] = useState("");
	const [clientId, setClientId] = useState("");
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [servers, setServers] = useRecoilState(serversState);
	const [error, setError] = useState(false);

	const onImportServerInvokedFromOutside = (params: ParamsFromOutside) => {
		setError(false);
		const { title, fhirUri, clientId } = params;
		const id = title;
		discoverAuthEndpoints(fhirUri)
			.then(({ authUri, tokenUri }) => {
				const newServer: Server = {
					id,
					title,
					fhirUri,
					authConfig: {
						authUri,
						tokenUri,
						clientId
					},
					session: undefined
				};
				setServers(oldServers => ({
					...oldServers,
					[id]: newServer
				}));
			})
			.then(() => {
				navigation.navigate("Auth", { serverId: id });
			})
			.catch(() => {
				setError(true);
		});
	};

	return (
		<>
			<Card m={"20px"}>
				<VStack space="lg">
					<FormControl>
						<FormControl.Label _text={{ color: "#7B7F87", fontSize: 14, fontWeight: 400 }}>
							Organization Name:
						</FormControl.Label>
						<Input
							value={title}
							onChangeText={title => setTitle(title)}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							placeholderTextColor="#333"/>
					</FormControl>
					<FormControl>
						<FormControl.Label _text={{ color: "#7B7F87", fontSize: 14, fontWeight: 400 }}>
							Server URI:
						</FormControl.Label>
						<Input
							value={fhirUri}
							onChangeText={fhirUri => setFhirUri(fhirUri)}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							placeholderTextColor="#333"/>
					</FormControl>
					<FormControl>
						<FormControl.Label _text={{ color: "#7B7F87", fontSize: 14, fontWeight: 400 }}>
							Client Id:
						</FormControl.Label>
						<Input
							value={clientId}
							onChangeText={clientId => setClientId(clientId)}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							placeholderTextColor="#333"/>
					</FormControl>
					{  error ? <Text color="red.500"> Couldn't connect to the server.</Text> : null }
				</VStack>
			</Card>
			<HStack
				m="20px"
				justifyContent="space-between"
			>
				<Button
					onPress={() => navigation.navigate("PatientProfile")}
					border={1}
					borderColor="#7b7f87"
					bg="#f8f9fb"
					_pressed={{
						backgroundColor: "#0069FF",
						_text: {
							color: "#fff"
						} }}
					_text={{ fontSize: 14, fontWeight: 400 }}
					w={"47%"}
				>
					Cancel
				</Button>
				<Button
					disabled={title.length === 0 || fhirUri.length === 0 || clientId.length === 0}
					w={"47%"}
					border={1}
					borderColor="#7b7f87"
					bg="#f8f9fb"
					_pressed={{
						backgroundColor: "#0069FF",
						_text: {
							color: "#fff"
						}}}
					_text={{ fontSize: 14, fontWeight: 400 }}
					onPress={() => onImportServerInvokedFromOutside({title, fhirUri, clientId})}
				>
					Add Server
				</Button>
			</HStack>
		</>
	);
};

export default AddServer;
