import React, { useEffect, useState } from "react";
import { Spinner } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Details from "./Details";
import LoginForm from "./LoginForm";
import { useRecoilState } from "recoil";
import role from "../recoil/someState";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RootStackParamList = {
	Home: undefined;
	Details: undefined;
	LoginForm: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const CurrentRole = (): JSX.Element => {
	const [roleState, setRoleState] = useRecoilState(role);
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		const getRole = async () => {
			const role: string | null = await AsyncStorage.getItem("@role");
			setRoleState(role);

			setShowLoader(false);
		};
		getRole();
	}, []);

	if (showLoader) {
		return	<Spinner style={{ alignSelf: "center", flex: 1 }} />;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{ roleState === null || roleState === "" ? (<>
					<Stack.Screen options={{ headerShown: false }} name="LoginForm" component={LoginForm} />
				</>
				):(
					<>
						<Stack.Screen name="Home"
							component={Home}
							options={{
								title: "Patient Dashboard",
								headerTitleAlign: "center"
							}} />
						<Stack.Screen name="Details" component={Details} />
					</>)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default CurrentRole;
