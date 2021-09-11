import React from "react";
import { HStack, VStack, View, ScrollView } from "native-base";
import { useRecoilValue } from "recoil";
import { patientInfoState } from "../recoil/patient";
import UserCard from "../components/home/UserCard";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { checkValue } from "../utils";


const PatientInfo = (): JSX.Element => {
	const patientInfo = useRecoilValue(patientInfoState);

	return (
		<ScrollView
			pt={2}
			pb={2}
		>
			<View p={5}>
				<HStack pb={5}>
					<UserCard />
				</HStack>
				<VStack space={5}>
					<ResourceCard title="Primary Information">
						<ResourceCardItem label="Patient ID" width={"135px"}>{ checkValue(patientInfo.id) }</ResourceCardItem>
						<ResourceCardItem label="Date of Birthday" width={"135px"}>{ checkValue(patientInfo.birthDate) }</ResourceCardItem>
						<ResourceCardItem label="Gender Identity" width={"135px"}>{ checkValue(patientInfo.gender) }</ResourceCardItem>
						<ResourceCardItem label="Primary Language" width={"135px"}>{ checkValue(patientInfo.language) }</ResourceCardItem>
					</ResourceCard>
					<ResourceCard title="Contact Information">
						<ResourceCardItem label="Home Address" width={"135px"}>{ checkValue(patientInfo.address) }</ResourceCardItem>
						<ResourceCardItem label="Phone Number" width={"135px"}>{ checkValue(patientInfo.phone) }</ResourceCardItem>
						<ResourceCardItem label="Email Address" width={"135px"}>{ checkValue(patientInfo.email) }</ResourceCardItem>
						<ResourceCardItem label="Employment Status" width={"135px"}>{ checkValue(patientInfo.employmentStatus) }</ResourceCardItem>
					</ResourceCard>
					<ResourceCard title="Other Information">
						<ResourceCardItem label="Race" width={"135px"}>{ checkValue(patientInfo.race) }</ResourceCardItem>
						<ResourceCardItem label="Ethnicity" width={"135px"}>{ checkValue(patientInfo.ethnicity) }</ResourceCardItem>
						<ResourceCardItem label="Education Level" width={"135px"}>{ checkValue(patientInfo.educationLevel) }</ResourceCardItem>
						<ResourceCardItem label="Marital Status" width={"135px"}>{ checkValue(patientInfo.maritalStatus) }</ResourceCardItem>
					</ResourceCard>
				</VStack>
			</View>
		</ScrollView>
	);
};

export default PatientInfo;
