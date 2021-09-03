import React, { useEffect } from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Details from "./screens/Details";
import Auth from "./screens/Auth";
import { useRecoilState } from "recoil";
import { Button, LogBox, View } from "react-native";
import { Server, serversState } from "./recoil/servers";
import { discoverAuthEndpoints } from "./utils/auth";
import { Icon, NativeBaseProvider, Link } from "native-base";
import LoginForm from "./screens/LoginForm";
import role from "./recoil/roleState/atom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import ClinicalStaff from "./screens/ClinicalStaff";
import Caregivers from "./screens/Caregivers";
import Organizations from "./screens/Organizations";
import Insurances from "./screens/Insurances";
import { RecoilRootWithPersisance } from "./recoil";
import ServerList from "./components/ServerList";
import PatientInfo from "./screens/PatientInfo";
import PatientProfile from "./screens/PatientProfile";
import { Path } from "react-native-svg";


// todo: temporary recoil fix, should be fixed in expo sdk that support react-native 0.64+, probably sdk 43
// https://github.com/facebookexperimental/Recoil/issues/1030
// https://github.com/facebookexperimental/Recoil/issues/951
LogBox && LogBox.ignoreLogs(["Setting a timer", "Can't perform a React state update on an unmounted component"]);


const App = () => (
	<NativeBaseProvider>
		<RecoilRootWithPersisance>
			<MainContainer />
		</RecoilRootWithPersisance>
	</NativeBaseProvider>
);



export type RootStackParamList = {
	Home: undefined,
	Details: undefined,
	Auth: { serverId: string },
	LoginForm: undefined,
	Caregivers: undefined,
	ClinicalStaff: undefined,
	Organizations: undefined,
	Insurances: undefined,
	Hub: undefined,
	ServerList: undefined,
	PatientInfo: undefined,
	PatientProfile: undefined
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
	clientId: "2ecabb44-200b-4975-a8d1-dc2a6e4f90a7"
};
const linkingUrl = Linking.createURL("import-server", { queryParams: logicaParams });
console.log("linking url:", linkingUrl);



const MainContainer = () => {
	useEffect(() => {
		Linking.addEventListener("url", ({ url }) => {
			const { path, queryParams } = Linking.parse(url);
			console.log("got linked", { path, queryParams });
			onImportServerInvokedFromOutside(queryParams as ParamsFromOutside);
		});
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
			});
	};


	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator
				initialRouteName="Hub"
				screenOptions={{
					headerTitleAlign: "center"
				}}
			>
				{ roleState === null ? (
					<Stack.Screen options={{ headerShown: false }} name="LoginForm" component={LoginForm} />
				) : (
					<>
						<Stack.Screen name="Home" component={Home} options={{ title: "Patient Dashboard", }} />
						<Stack.Screen name="ClinicalStaff" component={ClinicalStaff} options={{ title: "Clinical Staff" }} />
						<Stack.Screen name="Caregivers" component={Caregivers} />
						<Stack.Screen name="Organizations" component={Organizations} />
						<Stack.Screen name="Insurances" component={Insurances} />
						<Stack.Screen name="PatientInfo" component={PatientInfo} options={{ title: "Patient Information" }} />
						<Stack.Screen name="PatientProfile" component={PatientProfile} options={{ title: "Patient Profile",  headerRight: () => (
							<Link onPress={() => setRoleState(null)}>
								<Icon
									size={5}
									viewBox="0 0 20 20"
									fill="none"
								>
									<Path
										d="M8.18182 16C3.663 16 0 12.4184 0 8C0 3.5816 3.663 2.25463e-06 8.18182 2.25463e-06C9.45217 -0.000930914 10.7052 0.28782 11.8415 0.843315C12.9777 1.39881 13.9658 2.20574 14.7273 3.2H12.51C11.5652 2.38541 10.4001 1.85469 9.1544 1.67152C7.90875 1.48836 6.63551 1.66053 5.48745 2.16737C4.3394 2.67422 3.3653 3.49421 2.68206 4.52895C1.99881 5.56369 1.63544 6.76922 1.63554 8.00089C1.63565 9.23255 1.99923 10.438 2.68265 11.4727C3.36607 12.5073 4.34031 13.3271 5.48845 13.8338C6.63659 14.3404 7.90986 14.5124 9.15548 14.329C10.4011 14.1457 11.5661 13.6147 12.5108 12.8H14.7281C13.9666 13.7944 12.9783 14.6014 11.8419 15.1569C10.7055 15.7124 9.45231 16.0011 8.18182 16ZM13.9091 11.2V8.8H7.36364V7.2H13.9091V4.8L18 8L13.9091 11.2Z"
										fill="#0069FF"
									/>
								</Icon>
							</Link>
							)}}
						/>
						<Stack.Screen name="Details" component={Details} />
						<Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />

						<Stack.Screen name="ServerList" component={ServerList} />
						<Stack.Screen name="Hub" component={Hub} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;


const Hub =  ({ navigation }: NativeStackScreenProps<RootStackParamList, "Hub">) => {
	return (
		<View style={{
			flex: 1,
			alignItems: "center",
			justifyContent: "space-around",
			padding: 20
		}}>
			<Button
				title="Home"
				onPress={() => navigation.navigate("Home")}
			/>
			<Button
				title="Servers"
				onPress={() => navigation.navigate("ServerList")}
			/>
			<Button
				title="clear async store"
				onPress={() => AsyncStorage.clear()}
			/>
		</View>
	);
}
