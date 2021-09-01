import React from "react";
import { Avatar, HStack, Text, VStack } from "native-base";
import Card from "../Card";
import { useRecoilValue } from "recoil";
import { patientInfoState } from "../../recoil/patient";

const UserCard = ():JSX.Element => {
	const { name, email } = useRecoilValue(patientInfoState);

	return (
		<Card>
			<HStack alignItems="center">
				<Avatar size="55px">User</Avatar>
				<VStack ml={4}>
					<Text
						color="#333"
						fontSize="lg"
					>
						{ name }
					</Text>
					<Text
						color="#7b7f87"
						fontSize="sm"
					>
						{ email }
					</Text>
				</VStack>
			</HStack>
		</Card>
	);
};

export default UserCard;
