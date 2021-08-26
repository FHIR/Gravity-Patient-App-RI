import React, { ReactNode } from "react";
import { Box } from "native-base";

const Card = (props: { children: ReactNode }): JSX.Element => (
	<Box
		borderWidth={1}
		borderRadius={3}
		borderColor="#e7e7e7"
		bg="#fff"
		shadow={0}
		p={15}
		flex={1}
		{ ...props }
	>
		{ props.children }
	</Box>
);

export default Card;
