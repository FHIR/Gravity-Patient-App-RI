import React from "react";
import { Divider, HStack, Icon, Text, VStack } from "native-base";
import { Path } from "react-native-svg";
import Card from "../Card";
import { useRecoilValue } from "recoil";
import { requesterOrganizationState } from "../../recoil/requester";


const OrganizationsCard = ():JSX.Element => {
	const organizations = useRecoilValue(requesterOrganizationState);
	const active: number = organizations.filter(o => o.active).length;
	const total: number = organizations.length;

	return (
		<Card>
			<HStack
				space={1}
				alignItems="center"
				mb={4}
			>
				<Icon
					size={5}
					viewBox="0 0 20 20"
					fill="none"
				>
					<Path
						d="M3 14.7H16V16H3V14.7ZM4.3 9.5H5.6V14.05H4.3V9.5ZM7.55 9.5H8.85V14.05H7.55V9.5ZM10.15 9.5H11.45V14.05H10.15V9.5ZM13.4 9.5H14.7V14.05H13.4V9.5ZM3 6.25L9.5 3L16 6.25V8.85H3V6.25ZM4.3 7.0534V7.55H14.7V7.0534L9.5 4.4534L4.3 7.0534ZM9.5 6.9C9.32761 6.9 9.16228 6.83152 9.04038 6.70962C8.91848 6.58772 8.85 6.42239 8.85 6.25C8.85 6.07761 8.91848 5.91228 9.04038 5.79038C9.16228 5.66848 9.32761 5.6 9.5 5.6C9.67239 5.6 9.83772 5.66848 9.95962 5.79038C10.0815 5.91228 10.15 6.07761 10.15 6.25C10.15 6.42239 10.0815 6.58772 9.95962 6.70962C9.83772 6.83152 9.67239 6.9 9.5 6.9Z"
						fill="#BECDFF"
					/>
				</Icon>
				<Text
					fontSize="xs"
					fontWeight="medium"
					ml={1}
				>
					Organizations
				</Text>
			</HStack>
			<HStack justifyContent="space-evenly">
				<VStack>
					<Text
						color="#7b7f87"
						fontSize="xxs"
					>
						Active
					</Text>
					<Text
						fontSize="md"
						fontWeight="medium"
					>
						{ active }
					</Text>
				</VStack>

				<Divider orientation="vertical"/>

				<VStack>
					<Text
						color="#7b7f87"
						fontSize="xxs"
					>
						Total
					</Text>
					<Text
						fontSize="md"
						fontWeight="medium"
					>
						{ total }
					</Text>
				</VStack>
			</HStack>
		</Card>
	);
};

export default OrganizationsCard;
