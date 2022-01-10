import React, { ReactNode } from "react";
import Card from "./Card";
import { HStack, Text, VStack, Badge } from "native-base";


const ResourceCard = (props: { children: ReactNode, title: string, badge?: string }): JSX.Element => (
	<Card>
		<HStack
			mb={5}
			justifyContent="space-between"
		>
			<Text
				fontSize="lg"
				color="#464953"
				fontWeight="medium"
			>
				{ props.title || "" }
			</Text>

			{ props.badge ?
				<Badge
					rounded="md"
					backgroundColor="#E9F0FF"
					justifyContent="center"
				>
					<Text
						color="#464953"
						fontSize="xs"
						fontWeight="medium"
						textTransform="capitalize"
					>
						{ props.badge }
					</Text>
				</Badge> :
				<Text/>
			}
		</HStack>

		<VStack>
			{ props.children }
		</VStack>
	</Card>
);

export default ResourceCard;
