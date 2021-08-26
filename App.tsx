import React, { useEffect, useState } from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Details from "./screens/Details";
import Auth from "./screens/Auth";
import { RecoilRoot, useRecoilState } from "recoil";
import { Button, LogBox } from "react-native";
import { Server, serversState } from "./recoil/servers";
import { discoverAuthEndpoints } from "./utils/auth";
import { NativeBaseProvider, Spinner } from "native-base";
import LoginForm from "./screens/LoginForm";
import role from "./recoil/roleState/atom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";


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
	Auth: { serverId: string },
	LoginForm: undefined
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
const linkingUrl = Linking.createURL("import-server", { queryParams: logicaParams });
console.log("linking url:", linkingUrl);


const MainContainer = () => {
	useEffect(() => {
		Linking.addEventListener("url", ({ url }) => {
			const { path, queryParams } = Linking.parse(url);
			console.log("got linked", { path, queryParams });
			onImportServerInvokedFromOutside(queryParams as ParamsFromOutside);
		})
	}, []);

	useEffect(() => {
		Linking.getInitialURL().then(url => {
			if(url) {
				const { path, queryParams } = Linking.parse(url);
				console.log("got started by linking", { path, queryParams });
			}
		});
	}, []);

	const [roleState, setRoleState] = useRecoilState(role);
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		const getRole = async () => {
			// await AsyncStorage.removeItem("@role");
			const role: string | null = await AsyncStorage.getItem("@role");
			setRoleState(role);

			setShowLoader(false);
		};
		getRole();
	}, [setRoleState]);

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


	if (showLoader) {
		return	(<Spinner style={{ alignSelf: "center", flex: 1 }} />);
	}

	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator initialRouteName="Home">
				{ roleState === null ? (
					<Stack.Screen options={{ headerShown: false }} name="LoginForm" component={LoginForm} />
				) : (
					<>
						<Stack.Screen name="Home" component={Home} />
						<Stack.Screen name="Details" component={Details} />
						<Stack.Screen name="Auth" component={Auth} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;