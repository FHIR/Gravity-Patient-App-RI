import React from "react";
import { Divider, HStack, Icon, Text, VStack } from "native-base";
import { Path } from "react-native-svg";
import Card from "../Card";


const ReferralsCard = (): JSX.Element => {
	return (
		<Card>
			<Text
				color="#464953"
				fontSize="lg"
				fontWeight="medium"
				mb={5}
			>
				Referrals
			</Text>
			<HStack justifyContent="space-evenly">
				<VStack>
					<Text
						color="#464953"
						fontSize="xs"
					>
						New
					</Text>
					<HStack alignItems="center">
						<Icon
							size={5}
							viewBox="0 0 20 20"
							fill="none"
						>
							<Path
								d="M8.57143 9.57143V4H10.4286V9.57143H16V11.4286H10.4286V17H8.57143V11.4286H3V9.57143H8.57143Z"
								fill="#BECDFF"
							/>
						</Icon>
						<Text
							color="#333"
							fontWeight="medium"
							ml={1}
						>
							0
						</Text>
					</HStack>
				</VStack>

				<Divider orientation="vertical" />

				<VStack>
					<Text
						color="#464953"
						fontSize="xs"
					>
						In Progress
					</Text>
					<HStack alignItems="center">
						<Icon
							size={5}
							viewBox="0 0 20 20"
							fill="none"
						>
							<Path
								d="M9.5 4C5.91005 4 3 6.91005 3 10.5C3 14.0899 5.91005 17 9.5 17C13.0899 17 16 14.0899 16 10.5H14.7C14.7 13.3717 12.3717 15.7 9.5 15.7C6.6283 15.7 4.3 13.3717 4.3 10.5C4.3 7.6283 6.6283 5.3 9.5 5.3C11.2875 5.3 12.8644 6.20155 13.7997 7.575H12.1V8.875H16V4.975H14.7V6.6C13.5144 5.0205 11.6262 4 9.5 4ZM8.85 7.25V10.825L11.45 13.425L12.425 12.45L10.15 10.2302V7.25H8.85Z"
								fill="#BECDFF"
							/>
						</Icon>
						<Text
							color="#333"
							fontWeight="medium"
							ml={1}
						>
							0
						</Text>
					</HStack>
				</VStack>

				<Divider orientation="vertical" />

				<VStack>
					<Text
						color="#464953"
						fontSize="xs"
					>
						Submitted
					</Text>
					<HStack alignItems="center">
						<Icon
							size={5}
							viewBox="0 0 20 20"
							fill="none"
						>
							<Path
								d="M10.2321 10.8256L11.3285 11.8827L17.9021 5.5443L19 6.60294L11.3285 14L6.38705 9.23534L7.48497 8.17669L9.13497 9.76766L10.2321 10.8248V10.8256ZM10.2337 8.70826L14.0787 5L15.1736 6.05565L11.3285 9.76391L10.2337 8.70826ZM8.0386 12.9421L6.94145 14L2 9.23534L3.09793 8.17669L4.19508 9.23459L4.1943 9.23534L8.0386 12.9421Z"
								fill="#BECDFF"
							/>
						</Icon>
						<Text
							color="#333"
							fontWeight="medium"
							ml={1}
						>
							0
						</Text>
					</HStack>
				</VStack>
			</HStack>
		</Card>
	);
};

export default ReferralsCard;
