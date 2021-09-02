import React from "react";
import { Text, ScrollView } from "react-native";
import { useRecoilState } from "recoil";
import { serversState } from "../recoil/servers";


const ServerList = () => {
	const [servers] = useRecoilState(serversState);

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				padding: 20
			}}
		>
			<Text>{ JSON.stringify(servers, null, 2) }</Text>
		</ScrollView>
	);
}

export default ServerList;
