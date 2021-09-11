import React from "react";
import { ScrollView, Text, View } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { ownerClinicalStaff } from "../recoil/owner";
import { checkValue } from "../utils";


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
							<ResourceCard title={ checkValue(c.name) }>
								<ResourceCardItem label="Organization">
									{ checkValue(c.organization) }
								</ResourceCardItem>
								<ResourceCardItem label="Role">
									{ checkValue(c.role) }
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

export default ClinicalStaff;
