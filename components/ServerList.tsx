import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { VStack } from "native-base";
import React from "react";
import { ScrollView, View, Text, TouchableWithoutFeedback } from "react-native";
import { useRecoilState } from "recoil";
import { RootStackParamList } from "../App";
import { Server, serversState } from "../recoil/servers";
import Card from "./Card";


const ServerList = ({ navigation }: NativeStackScreenProps<RootStackParamList, "ServerList">) => {
	const [serversHash] = useRecoilState(serversState);
	const servers = Object.values(serversHash);

	return (
		<ScrollView
			contentContainerStyle={{
				alignItems: "stretch",
				padding: 20
			}}
		>
			<VStack space={5}>
				{servers.map(s => ServerCard(s, () => navigation.navigate("ServerView", { serverId: s.id })))}
			</VStack>
		</ScrollView>
	);
}

const ServerCard = (server: Server, onPress: () => void) => (
	<TouchableWithoutFeedback key={server.id} onPress={onPress}>
		<Card>
			<>
				<Text
					style={{ fontSize: 18, color: "#464953", fontWeight: "500" }}
				>
					{server.title}
				</Text>
				<View
					style={{
						flexDirection: "row"
					}}
				>
					<Text style={{ width: 95 }}>
						Server URI:
					</Text>
					<Text numberOfLines={1} style={{ flex: 1 }}>{server.fhirUri}</Text>
				</View>
			</>
		</Card>
	</TouchableWithoutFeedback>
)

export default ServerList;
