import React from "react";
import { HStack, ScrollView } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";


//todo: loop through actual data
const ClinicalStaff = (): JSX.Element => (
	<ScrollView p={5}>
		<HStack mb={5}>
			<ResourceCard
				title="Carla Sanchez"
				badge="Primary"
			>
				<ResourceCardItem label="Organization">
					Sanchez Family Practice
				</ResourceCardItem>
				<ResourceCardItem label="Role">
					Primary Care Physician
				</ResourceCardItem>
				<ResourceCardItem label="Location">
					San Francisco
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					(213) 639-3911
				</ResourceCardItem>
			</ResourceCard>
		</HStack>

		<HStack>
			<ResourceCard title="Samir Patel">
				<ResourceCardItem label="Organization">
					Sanchez Family Practice
				</ResourceCardItem>
				<ResourceCardItem label="Role">
					Clinical Staff Member
				</ResourceCardItem>
				<ResourceCardItem label="Location">
					San Francisco
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					(213) 639-3912
				</ResourceCardItem>
			</ResourceCard>
		</HStack>
	</ScrollView>
);

export default ClinicalStaff;
