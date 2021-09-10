import React, { useEffect } from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Referrals from "./screens/Referrals";
import Assessments from "./screens/Assessments";
import Auth from "./screens/Auth";
import { useRecoilState } from "recoil";
import {Button, LogBox, View} from "react-native";
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
import ServerView from "./screens/ServerView";
import AddServer from "./screens/AddServer";
import ReferralView from "./screens/ReferralView";


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
	Auth: { serverId: string },
	LoginForm: undefined,
	Caregivers: undefined,
	ClinicalStaff: undefined,
	Organizations: undefined,
	Insurances: undefined,
	Hub: undefined,
	ServerList: undefined,
	PatientInfo: undefined,
	PatientProfile: undefined,
	Referrals: undefined,
	Assessments: undefined,
	ServerView: { serverId: string },
	AddServer: undefined
	ReferralView: { referralId: string | undefined }
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

	const [roleState] = useRecoilState(role);

	const [servers, setServers] = useRecoilState(serversState);

	const onImportServerInvokedFromOutside = (params: ParamsFromOutside) => {
		const { title, fhirUri, clientId } = params;
		const id = title;
		discoverAuthEndpoints(fhirUri)
			.then(({ authUri, tokenUri }) => {
				const newServer: Server = {
					id,
					title,
					fhirUri,
					authConfig: {
						authUri,
						tokenUri,
						clientId
					},
					session: undefined
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
						<Stack.Screen name="PatientProfile" component={PatientProfile} options={{ title: "Patient Profile" }} />
						<Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
						<Stack.Screen name="ServerView" component={ServerView} options={{ title: "" }} />
						<Stack.Screen name="AddServer" component={AddServer} options={{ title: "New Server" }} />

						<Stack.Screen name="ServerList" component={ServerList} />
						<Stack.Screen name="Hub" component={Hub} />
						<Stack.Screen name="Referrals" component={Referrals} />
						<Stack.Screen name="ReferralView" component={ReferralView} />
						<Stack.Screen name="Assessments" component={Assessments} />
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
				title="Assessments"
				onPress={() => navigation.navigate("Assessments")}
			/>
			<Button
				title="clear async store"
				onPress={() => AsyncStorage.clear()}
			/>
		</View>
	);
}
