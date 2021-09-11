import React from "react";
import { ScrollView, View, Text } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { ownerCaregiverState } from "../recoil/owner";
import { checkValue } from "../utils";


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
							<ResourceCard title={ checkValue(c.name) }>
								<ResourceCardItem label="Relationship">
									{ checkValue(c.relationship) }
								</ResourceCardItem>
								<ResourceCardItem label="Organization">
									{ checkValue(c.organization) }
								</ResourceCardItem>
								<ResourceCardItem label="Location">
									{ checkValue(c.location) }
								</ResourceCardItem>
								<ResourceCardItem label="Phone">
									{ checkValue(c.phone) }
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
