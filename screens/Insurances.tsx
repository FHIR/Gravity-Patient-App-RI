import React from "react";
import { ScrollView, HStack } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";


//todo: loop through actual data
const Insurances = (): JSX.Element => (
	<ScrollView p={5}>
		<HStack mb={5}>
			<ResourceCard
				title="Blue Shield of CA"
				badge="Primary"
			>
				<ResourceCardItem label="Location">
					9601 Wilshire Blvd, Beverly Hills, CA 90210, United States
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					(888) 568-3560
				</ResourceCardItem>
				<ResourceCardItem label="Email">
					https://www.blueshieldca.com
				</ResourceCardItem>
			</ResourceCard>
		</HStack>

		<HStack>
			<ResourceCard title="Blue Cross Blue Shield">
				<ResourceCardItem label="Location">
					5150 CA-1, Long Beach, CA 90804, United States
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					+13234332890
				</ResourceCardItem>
				<ResourceCardItem label="Email">
					https://www.anthem.com
				</ResourceCardItem>
			</ResourceCard>
		</HStack>
	</ScrollView>
);

export default Insurances;
