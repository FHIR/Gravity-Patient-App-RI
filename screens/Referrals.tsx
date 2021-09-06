import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Task } from "fhir/r4";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { filterNewTasks, filterInProgressTasks, filterSubmittedTasks } from "../utils";
import { ScrollView, View, Text } from "native-base";
import { useRecoilValue } from "recoil";
import { taskReferralState } from "../recoil/task";

const Tab = createMaterialTopTabNavigator();

const TaskList = (tasks: Task[]): JSX.Element => (
	<ScrollView p={5}>
		{
			tasks.length ?
				tasks.map((t, i) => (
					<View
						mb={5}
						key={i}
					>
						<ResourceCard title={t.code?.text || "N/A"}>
							<ResourceCardItem label="Occurrence">
								{ "N/A" }
							</ResourceCardItem>
							<ResourceCardItem label="Request Date">
								{ "N/A" }
							</ResourceCardItem>
							<ResourceCardItem label="Sent By">
								{ "N/A" }
							</ResourceCardItem>
						</ResourceCard>
					</View>
				)) :
				<View
					flex={1}
					alignItems="center"
				>
					<Text>No Data Yet</Text>
				</View>
		}
	</ScrollView>
);

const New = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const newTasks = filterNewTasks(referrals);

	return TaskList(newTasks);
};

const InProgress = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const inProgressTasks = filterInProgressTasks(referrals);

	return TaskList(inProgressTasks);
};

const Submitted = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const submittedTasks = filterSubmittedTasks(referrals);

	return TaskList(submittedTasks);
};

const Referrals = (): JSX.Element => (
	<Tab.Navigator>
		<Tab.Screen name="New" component={New} />
		<Tab.Screen name="In Progress" component={InProgress} />
		<Tab.Screen name="Submitted" component={Submitted} />
	</Tab.Navigator>
);

export default Referrals;
