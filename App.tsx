import React from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Details from "./screens/Details";
import Auth from "./screens/Auth";
import { RecoilRoot, useRecoilState } from "recoil";
import { Button, LogBox } from "react-native";
import { Server, serversState } from "./recoil/servers";
import { discoverAuthEndpoints } from "./utils/auth";
import { NativeBaseProvider } from "native-base";

// todo: temporary recoil fix, should be fixed in expo sdk that support react-native 0.64+, probably sdk 43
// https://github.com/facebookexperimental/Recoil/issues/1030
// https://github.com/facebookexperimental/Recoil/issues/951
LogBox.ignoreLogs(["Setting a timer", "Can't perform a React state update on an unmounted component"]);


const App = (): JSX.Element =>
	(<RecoilRoot>
		<NativeBaseProvider>
			<MainContainer />
		</NativeBaseProvider>
	</RecoilRoot>);


export type RootStackParamList = {
	Home: undefined;
	Details: undefined;
	Auth: { serverId: string }
};
const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();


type ParamsFromOutside = {
	title: string,
	fhirUri: string,
	clientId: string
}

const logicaParams = {
	title: "Logica",
	fhirUri: "https://api.logicahealth.org/deezsandbox/data",
	clientId: "2ecabb44-200b-4975-a8d1-dc2a6e4f90a7",
};

const MainContainer = () => {
	const [servers, setServers] = useRecoilState(serversState);

	const onImportServerInvokedFromOutside = (params: ParamsFromOutside) => {
		const { title, fhirUri, clientId } = params;
		const id = title;
		discoverAuthEndpoints(fhirUri)
			.then(({ authUri, tokenUri }) => {
				const newServer: Server = {
					title,
					fhirUri,
					authConfig: {
						authUri,
						tokenUri,
						clientId
					},
					session: null
				};
				setServers(oldServers => ({
					...oldServers,
					[id]: newServer
				}));
			})
			.then(() => {
				navigationRef.navigate("Auth", { serverId: id });
			})
	};

	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen
					name="Home"
					component={Home}
					options={{
						headerRight: () => (
							<Button
								title="click"
								onPress={() => onImportServerInvokedFromOutside(logicaParams)}
							/>
						)
					}}
				/>
				<Stack.Screen name="Details" component={Details} />
				<Stack.Screen name="Auth" component={Auth} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;