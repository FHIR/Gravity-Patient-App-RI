import React from "react";
import { ScrollView, Text, View } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { ownerClinicalStaff } from "../recoil/owner";


const ClinicalStaff = (): JSX.Element => {
	const clinicalStaffs = useRecoilValue(ownerClinicalStaff);

	return (
		<ScrollView p={5}>
			{
				clinicalStaffs.length ?
					clinicalStaffs.map((c, i) => (
						<View
							mb={5}
							key={i}
						>
							<ResourceCard title={c.name || "N/A"}>
								<ResourceCardItem label="Organization">
									{ c.organization || "N/A" }
								</ResourceCardItem>
								<ResourceCardItem label="Role">
									{ c.role || "N/A" }
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

export default ClinicalStaff;
