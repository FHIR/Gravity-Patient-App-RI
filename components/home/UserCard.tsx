import React from "react";
import { Avatar, HStack, Text, VStack } from "native-base";
import Card from "../Card";
import { useRecoilValue } from "recoil";
import { patientInfoState } from "../../recoil/patient";

const UserCard = ():JSX.Element => {
	const patientInfo = useRecoilValue(patientInfoState);

	return (
		<Card flex={1}>
			<HStack alignItems="center">
				<Avatar
					size="55px"
					source={{
						uri: patientInfo.photo
					}}
				>
					User
				</Avatar>
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
