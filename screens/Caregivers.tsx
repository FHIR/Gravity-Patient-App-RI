import React from "react";
import { HStack, ScrollView } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";


//todo: loop through actual data
const Caregivers = (): JSX.Element => (
	<ScrollView p={5}>
		<HStack mb={5}>
			<ResourceCard
				title="Reeza Shah"
				badge="Primary"
			>
				<ResourceCardItem label="Relationship">
					Nurse
				</ResourceCardItem>
				<ResourceCardItem label="Organization">
					Sanchez Family Practice
				</ResourceCardItem>
				<ResourceCardItem label="Location">
					San Francisco
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					(213) 639-3913
				</ResourceCardItem>
			</ResourceCard>
		</HStack>
	</ScrollView>
);

export default Caregivers;
