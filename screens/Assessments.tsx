import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { ScrollView, View, Text, Pressable } from "native-base";
import { useRecoilValue } from "recoil";
import { taskAssessmentState } from "../recoil/task";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Assessment } from "../recoil/task/assessment";

const Tab = createMaterialTopTabNavigator();

const TaskList = (assessments: Assessment[]) => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	return (
		<ScrollView p={5}>
			{
				assessments.length ?
					assessments.map((a, i) => (
						<View
							mb={5}
							key={i}
						>
							<Pressable
								onPress={() => navigation.navigate("Assessment", { assessmentId: a.id })}
							>
								<ResourceCard title={a.task.code?.text || "untitled"}>
									<ResourceCardItem label="Request Date">
										{a.sentDate}
									</ResourceCardItem>
									<ResourceCardItem label="Sent By">
										{a.requesterName || "N/A"}
									</ResourceCardItem>
								</ResourceCard>
							</Pressable>
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
};

const New = (): JSX.Element => {
	const assessments = useRecoilValue(taskAssessmentState);
	const newAsms = assessments.filter(asm => !asm.response);

	return TaskList(newAsms);
};

const InProgress = (): JSX.Element => {
	const assessments = useRecoilValue(taskAssessmentState);

	return TaskList([]);
};

const Submitted = (): JSX.Element => {
	const assessments = useRecoilValue(taskAssessmentState);
	const submittedAsms = assessments.filter(asm => asm.response);

	return TaskList(submittedAsms);
};

const Assessments = (): JSX.Element => (
	<Tab.Navigator>
		<Tab.Screen name="New" component={New} />
		<Tab.Screen name="In Progress" component={InProgress} />
		<Tab.Screen name="Submitted" component={Submitted} />
	</Tab.Navigator>
);

export default Assessments;
