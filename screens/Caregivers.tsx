import React from "react";
import { ScrollView, View, Text } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { ownerCaregiverState } from "../recoil/owner";


const Caregivers = (): JSX.Element => {
	const caregivers = useRecoilValue(ownerCaregiverState);

	return (
		<ScrollView p={5}>
			{
				caregivers.length ?
					caregivers.map((c, i) => (
						<View
							mb={5}
							key={i}
						>
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

export default Caregivers;
