import React from "react";
import { ScrollView, HStack, View, Text } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { payorInsuranceState } from "../recoil/payor";


const Insurances = (): JSX.Element => {
	const insurances = useRecoilValue(payorInsuranceState);

	return (
		<ScrollView p={5}>
			{
				insurances.length ?
					insurances.map((o, i) => (
						<HStack
							mb={5}
							key={i}
						>
							<ResourceCard title={o.name || "N/A"}>
								<ResourceCardItem label="Location">
									{ o.location || "N/A" }
								</ResourceCardItem>
								<ResourceCardItem label="Phone">
									{ o.phone || "N/A" }
								</ResourceCardItem>
								<ResourceCardItem label="Email">
									{ o.email || "N/A" }
								</ResourceCardItem>
							</ResourceCard>
						</HStack>
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

export default Insurances;
