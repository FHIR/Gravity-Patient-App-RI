import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Details from "./screens/Details";
import { RecoilRoot } from "recoil";
import { LogBox } from "react-native";
import { NativeBaseProvider } from "native-base";

// todo: temporary recoil fix, should be fixed in expo sdk that support react-native 0.64+, probably sdk 43
// https://github.com/facebookexperimental/Recoil/issues/1030
// https://github.com/facebookexperimental/Recoil/issues/951
LogBox && LogBox.ignoreLogs(["Setting a timer", "Can't perform a React state update on an unmounted component"]);


export type RootStackParamList = {
	Home: undefined;
	Details: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): JSX.Element =>
	(<RecoilRoot>
		<NativeBaseProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen
						name="Home"
						component={Home}
						options={{
							title: "Patient Dashboard",
							headerTitleAlign: "center"
						}}
					/>
					<Stack.Screen name="Details" component={Details} />
				</Stack.Navigator>
			</NavigationContainer>
		</NativeBaseProvider>
	</RecoilRoot>);

export default App;
