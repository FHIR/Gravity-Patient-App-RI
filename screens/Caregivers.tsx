import React from "react";
import { HStack, ScrollView, View, Text } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { requesterCaregiverState } from "../recoil/requester";


const Caregivers = (): JSX.Element => {
	const caregivers = useRecoilValue(requesterCaregiverState);

	return (
		<ScrollView p={5}>
			{
				caregivers.length ?
				caregivers.map(c => (
					<HStack mb={5}>
						<ResourceCard title={c.name || "N/A"}>
							<ResourceCardItem label="Relationship">
								{ c.relationship || "N/A" }
							</ResourceCardItem>
							<ResourceCardItem label="Organization">
								{ c.organization || "N/A" }
							</ResourceCardItem>
							<ResourceCardItem label="Location">
								{ c.location || "N/A" }
							</ResourceCardItem>
							<ResourceCardItem label="Phone">
								{ c.phone || "N/A" }
							</ResourceCardItem>
						</ResourceCard>
					</HStack>
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

export default Caregivers;
