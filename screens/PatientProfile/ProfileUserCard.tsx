import React from "react";
import { Avatar, Button, Text, VStack } from "native-base";
import Card from "../../components/Card";
import { useRecoilValue } from "recoil";
import { patientInfoState } from "../../recoil/patient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

const ProfileUserCard = (): JSX.Element => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const patientInfo = useRecoilValue(patientInfoState);

	return (
		<Card>
			<VStack alignItems="center">
				<Avatar
					mb="20px"
					size="100px"
					source={{
						uri: patientInfo.photo
					}}
				>
					User
				</Avatar>
				<Text
					color="#333"
					fontSize="lg"
				>
					{ patientInfo.name } { patientInfo.family }
				</Text>
				<Text
					color="#7b7f87"
					fontSize="sm"
					mb="5px"
					mt="5px"
				>
					{ patientInfo.email }
				</Text>
				<Button
					variant="link"
					_text={{
						color: "#0069FF",
						textDecoration: "none",
						fontSize: "sm",
						fontWeight: "400"
					}}
					onPress={() => navigation.navigate("PatientInfo")}
				>
					View Patient Information
				</Button>
			</VStack>
		</Card>
	);
};

export default ProfileUserCard;
