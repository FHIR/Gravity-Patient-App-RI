import React from "react";
import { View, Text, Button } from "react-native";
import { useRecoilState } from "recoil";
import someStateAtom from "../recoil/someState";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

const Home = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">): JSX.Element => {
	const [someState, setSomeState] = useRecoilState(someStateAtom);

	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<Text>Home Screen</Text>
			<Text>{ someState }</Text>
			<View style={{ marginBottom: 50 }}>
				<Button
					title={"Change State"}
					onPress={() => setSomeState(`${someState}!`)}
				/>
			</View>

			<Button
				title="Go to Details"
				onPress={() => navigation.navigate("Details")}
			/>
		</View>
	);
};

export default Home;
