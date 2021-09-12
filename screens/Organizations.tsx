import React from "react";
import { ScrollView, Text, View } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { ownerOrganizationState } from "../recoil/owner";
import { checkValue } from "../utils";


const Organizations = (): JSX.Element => {
	const organizations = useRecoilValue(ownerOrganizationState);

	return (
		<ScrollView p={5}>
			{
				organizations.length ?
					organizations.map((o, i) => (
						<View
							mb={5}
							key={i}
						>
							<ResourceCard
								title={ checkValue(o.name)}
								badge={ o.active ? "Active" : "" }
							>
								<ResourceCardItem label="Type">
									{ checkValue(o.type) }
								</ResourceCardItem>
								<ResourceCardItem label="Location">
									{ checkValue(o.location) }
								</ResourceCardItem>
								<ResourceCardItem label="Phone">
									{ checkValue(o.phone) }
								</ResourceCardItem>
								<ResourceCardItem label="Website">
									{ checkValue(o.website) }
								</ResourceCardItem>
								<ResourceCardItem label="Fax">
									{ checkValue(o.fax) }
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

export default Organizations;
