import React from "react";
import { Avatar, Link, Text, VStack } from "native-base";
import Card from "../Card";
import { useRecoilValue } from "recoil";
import { patientInfoState } from "../../recoil/patient";
import { useNavigation } from "@react-navigation/native";

const ProfileUserCard = (): JSX.Element => {
	const navigation = useNavigation();
	const patientInfo = useRecoilValue(patientInfoState);

	return (
		<Card>
			<VStack alignItems="center">
				<Avatar mb="20px" size="100px">User</Avatar>
				<Text
					color="#333"
					fontSize="lg"
				>
					{ patientInfo.name }
				</Text>
				<Text
					color="#7b7f87"
					fontSize="sm"
					mb="15px"
					mt="5px"
				>
					{ patientInfo.email }
				</Text>
				<Link
					_text={{
						color: "#0069FF"
					}}
					onPress={() => navigation.navigate("PatientInfo")}
					isExternal
				>
					View Patient Information
				</Link>
			</VStack>
		</Card>
	);
};

export default ProfileUserCard;
