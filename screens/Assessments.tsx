import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Task } from "fhir/r4";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { filterNewTasks, filterInProgressTasks, filterSubmittedTasks } from "../utils";
import { ScrollView, View, Text } from "native-base";
import { useRecoilValue } from "recoil";
import { taskAssessmentState } from "../recoil/task";

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
							<ResourceCardItem label="Request Date">
								{ "N/A" }
							</ResourceCardItem>
							<ResourceCardItem label="Sent by">
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
	const assessments = useRecoilValue(taskAssessmentState);
	const newTasks = filterNewTasks(assessments);

	return TaskList(newTasks);
};

const InProgress = (): JSX.Element => {
	const assessments = useRecoilValue(taskAssessmentState);
	const inProgressTasks = filterInProgressTasks(assessments);

	return TaskList(inProgressTasks);
};

const Submitted = (): JSX.Element => {
	const assessments = useRecoilValue(taskAssessmentState);
	const submittedTasks = filterSubmittedTasks(assessments);

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
