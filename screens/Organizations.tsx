import React from "react";
import { ScrollView, Text, View } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { ownerOrganizationState } from "../recoil/owner";


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
								title={o.name || "N/A"}
								badge={ o.active ? "Active" : "" }
							>
								<ResourceCardItem label="Type">
									{ o.type || "N/A" }
								</ResourceCardItem>
								<ResourceCardItem label="Location">
									{ o.location || "N/A" }
								</ResourceCardItem>
								<ResourceCardItem label="Phone">
									{ o.phone || "N/A" }
								</ResourceCardItem>
								<ResourceCardItem label="Website">
									{ o.website || "N/A" }
								</ResourceCardItem>
								<ResourceCardItem label="Fax">
									{ o.fax || "N/A" }
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
