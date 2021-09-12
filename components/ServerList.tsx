import { VStack, View } from "native-base";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { useRecoilState } from "recoil";
import { Server, serversState } from "../recoil/servers";
import ResourceCard from "./ResourceCard";
import ResourceCardItem from "./ResourceCardItem";


const ServerList = ({ onPress }: { onPress: (id: string) => void }) => {
	const [serversHash] = useRecoilState(serversState);
	const servers = Object.values(serversHash);

	return (
		<View>
			<VStack space={5}>
				{servers.map(s => ServerCard(s, () => onPress(s.id)))}
			</VStack>
		</View>
	);
};

const ServerCard = (server: Server, onPress: () => void) => (
	<TouchableWithoutFeedback key={server.id} onPress={onPress}>
		<VStack mt="20px">
			<ResourceCard title={server.title.toString()}>
				<ResourceCardItem label="Org Name" width={"100px"}>{ server.title }</ResourceCardItem>
				<ResourceCardItem label="Server URI" width={"100px"} truncate>{ server.fhirUri }</ResourceCardItem>
				<ResourceCardItem label="Last Sync" width={"100px"}> N/A </ResourceCardItem>
			</ResourceCard>
		</VStack>
	</TouchableWithoutFeedback>
);

export default ServerList;
