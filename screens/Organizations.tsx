import React from "react";
import { HStack, ScrollView } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";


//todo: loop through actual data
const Organizations = (): JSX.Element => (
	<ScrollView p={5}>
		<HStack mb={5}>
			<ResourceCard
				title="Sanchez Family Practice"
				badge="Active"
			>
				<ResourceCardItem label="Type">
					Provider
				</ResourceCardItem>
				<ResourceCardItem label="Location">
					2425 Geary Blvd, San Francisco, CA 94115, USA
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					(213) 639-3911
				</ResourceCardItem>
				<ResourceCardItem label="Email">
					https://www.healthgrades.com
				</ResourceCardItem>
			</ResourceCard>
		</HStack>

		<HStack mb={5}>
			<ResourceCard
				title="Health Level Seven International"
				badge="Active"
			>
				<ResourceCardItem label="Type">
					Community Based Organization
				</ResourceCardItem>
				<ResourceCardItem label="Location">
					3300 Washtenaw Avenue, Suite 227, MI, 48104, Ann Arbor, USA
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					(+1) 734-677-7777
				</ResourceCardItem>
				<ResourceCardItem label="Email">
					hq@HL7.org
				</ResourceCardItem>
			</ResourceCard>
		</HStack>

		<HStack mb={5}>
			<ResourceCard title="Burgers UMC Cardiology until">
				<ResourceCardItem label="Type">
					Coordination Platform
				</ResourceCardItem>
				<ResourceCardItem label="Location">
					2500 N State St, Jackson, MS 39216, South Wing, floor 2, USA
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					022-655 2320
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					022-655 2321
				</ResourceCardItem>
				<ResourceCardItem label="Fax">
					022-655 2322
				</ResourceCardItem>
			</ResourceCard>
		</HStack>

		<HStack>
			<ResourceCard title="Burgers University Medical Center">
				<ResourceCardItem label="Type">
					Provider
				</ResourceCardItem>
				<ResourceCardItem label="Location">
					Galapagosweg 91 Den Burg 9105 PZ NLD
				</ResourceCardItem>
				<ResourceCardItem label="Phone">
					022-655 2300
				</ResourceCardItem>
				<ResourceCardItem label="Fax">
					022-655 2335
				</ResourceCardItem>
			</ResourceCard>
		</HStack>
	</ScrollView>
);

export default Organizations;
