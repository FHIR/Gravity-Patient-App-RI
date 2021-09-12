import React from "react";
import { ScrollView, View, Text } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { useRecoilValue } from "recoil";
import { payorInsuranceState } from "../recoil/payor";
import { checkValue } from "../utils";


const Insurances = (): JSX.Element => {
	const insurances = useRecoilValue(payorInsuranceState);

	return (
		<ScrollView p={5}>
			{
				insurances.length ?
					insurances.map((o, i) => (
						<View
							mb={5}
							key={i}
						>
							<ResourceCard title={checkValue(o.name)}>
								<ResourceCardItem label="Location">
									{ checkValue(o.location) }
								</ResourceCardItem>
								<ResourceCardItem label="Phone">
									{ checkValue(o.phone) }
								</ResourceCardItem>
								<ResourceCardItem label="Email">
									{ checkValue(o.email) }
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

export default Insurances;
