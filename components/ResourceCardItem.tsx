import React, { ReactNode } from "react";
import { HStack, Text, VStack } from "native-base";


const ResourceCardItem = ({ children, truncate, ...props }: { children: string | string[], label: string, width?: string, truncate?: boolean }): JSX.Element => (
	<ResourceCardItemCustom {...props}>
		<VStack flex={1}>
			{(Array.isArray(children) ? children : [children]).map((child, ix) => (
				<Text
					key={ix}
					fontSize="sm"
					color="#333"
					isTruncated={truncate || false}
				>
					{ child }
				</Text>
			))}
		</VStack>
	</ResourceCardItemCustom>
);

export const ResourceCardItemCustom = (props: { children: ReactNode, label: string, width?: string }): JSX.Element => (
	<HStack mb="15px">
		<Text
			fontSize="sm"
			color="#7B7F87"
			w={ props.width || "100px" }
		>
			{ props.label }:
		</Text>
		{ props.children }
	</HStack>
);

export default ResourceCardItem;
