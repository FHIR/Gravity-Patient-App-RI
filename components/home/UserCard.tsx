import React from "react";
import { Avatar, HStack, Text, VStack } from "native-base";
import Card from "../Card";
import { useRecoilValue } from "recoil";
import { patientInfoState } from "../../recoil/patient";

const UserCard = ():JSX.Element => {
	const patientInfo = useRecoilValue(patientInfoState);

	return (
		<Card w={"100%"}>
			<HStack alignItems="center">
				<Avatar size="55px">User</Avatar>
				<VStack ml={4}>
					<Text
						color="#333"
						fontSize="lg"
					>
						{ patientInfo.name }
					</Text>
					<Text
						color="#7b7f87"
						fontSize="sm"
					>
						{ patientInfo.email }
					</Text>
				</VStack>
			</HStack>
		</Card>
	);
};

export default UserCard;
