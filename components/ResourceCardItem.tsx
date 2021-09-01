import React, { ReactNode } from "react";
import { HStack, Text } from "native-base";


const ResourceCardItem = (props: { children: ReactNode, label: string, isPatientInfoComponent: boolean }): JSX.Element => (
	<HStack>
		<Text
			fontSize="sm"
			color="#7B7F87"
			mb="15px"
			w={ props.isPatientInfoComponent ? "135px" : "100px"}
		>
			{ props.label }:
		</Text>
		<Text
			flex={1}
			fontSize="sm"
			color="#333"
		>
			{ props.children }
		</Text>
	</HStack>
);

export default ResourceCardItem;
