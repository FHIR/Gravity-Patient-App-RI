import React from "react";
import { View, Text, Button } from "react-native";
import { useRecoilState } from "recoil";
import role from "../recoil/someState/atom";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./CurrentRole";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">): JSX.Element => {
	const [roleState, setRoleState] = useRecoilState(role);

	const changeState = async () => {
		await AsyncStorage.setItem("@role", "");
	};


	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<Text>Home Screen</Text>
			<Text>{ roleState }</Text>
			<View style={{ marginBottom: 50 }}>
				<Button
					title={"Change State"}
					onPress={() => changeState()}
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
