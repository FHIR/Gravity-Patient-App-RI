import React, { useState } from "react";
import { StatusBar, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Text, View, VStack, Box, Heading, Checkbox, Button } from "native-base";
import Card from "../components/Card";
import restrictionSettings from "../recoil/restrictionSettings";
import { useRecoilState } from "recoil";
import { serversState } from "../recoil/servers";
import ServerList from "./ServerList";
import { useNavigation } from "@react-navigation/native";

const FirstRoute = () => {
	const [settingsState] = useRecoilState(restrictionSettings);
	const [groupValue, setGroupValue] = React.useState([]);

	const getSelectedGroupValue = () => {
		if (groupValue.length === 0) return "[]";
		let arrayString = groupValue.reduce(
			(accumulator, currentValue) => accumulator + ", " + currentValue
		);
		return "[" + arrayString + "]";
	}

	return (
		<View mt={5} flex={1}>
			<Card>
				<Heading fontSize="md" mb={2} fontWeight="500">Select categories</Heading>
				<Checkbox.Group
					colorScheme="blue"
					defaultValue={groupValue}
					accessibilityLabel="choose multiple items"
					onChange={(values) => {
						setGroupValue(values || [])
					}}
				>
					{settingsState.settings.map((setting: { checked: boolean, value: string }, index: number) => (
						<Checkbox
							key={index}
							value={setting.value}
							isChecked={setting.checked}
							my={1}
						>
							<Text ml={2} fontSize="md">{`${setting.value}`}</Text>
						</Checkbox>
					))}
				</Checkbox.Group>
				{/*<VStack mt={3}>*/}
				{/*	<Box>*/}
				{/*		<Text fontSize="md">Selected Values: </Text>*/}
				{/*		<Text fontSize="md" bold>*/}
				{/*			{getSelectedGroupValue()}*/}
				{/*		</Text>*/}
				{/*	</Box>*/}
				{/*</VStack>*/}
			</Card>
		</View>
	);
}

const SecondRoute = () => {
	const navigation = useNavigation();

	return (
		<View>
			<ServerList onPress={id => navigation.navigate("ServerView", { serverId: id })}/>
			<Button
				bg="#0069FF"
				mt="5"
				_text={{
					color: "white",
				}}
				onPress={() => navigation.navigate("AddServer")}
			>
				Add New Server
			</Button>
		</View>
	)
};


const renderScene = SceneMap({
	RestrictionSettings: FirstRoute,
	servers: SecondRoute,
})

export default function PatientProfileTabs() {
	const [serversHash] = useRecoilState(serversState);
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: "RestrictionSettings", title: "Restriction Settings" },
		{ key: "servers", title: `servers (${ Object.keys(serversHash).length})` }
	]);

	const renderTabBar = props => (
		<TabBar
			{...props}
			labelStyle={{ color: "#333", fontSize: 14, fontWeight: "500", textTransform: "capitalize" }}
			indicatorStyle={{ backgroundColor: "#0069FF" }}
			indicatorContainerStyle={{ borderBottomColor: "#E7E7E7", borderBottomWidth: 1 }}
			style={{ backgroundColor: "#F8F9FB" }}
			scrollEnabled={false}
		/>
	);

	return (
		<TabView
			renderTabBar={renderTabBar}
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			swipeEnabled={true}
			initialLayout={{ width: Dimensions.get('window').width }}
			style={{ marginTop: StatusBar.currentHeight, height: index === 0 ? 700 : 1000 }}
		/>
	);
}
