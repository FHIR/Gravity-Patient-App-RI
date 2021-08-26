import React from "react";
import { Avatar, HStack, Text, VStack } from "native-base";
import Card from "../Card";
import { useRecoilState } from "recoil";
import patientState from "../../recoil/patient";

const UserCard = ():JSX.Element => {
	const [patient] = useRecoilState(patientState);
	console.log(patient);
	const name = patient[0]?.name[0].given.join(" ");
	const email = patient[0]?.telecom?.find(tele => tele.system === "email").value;

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
