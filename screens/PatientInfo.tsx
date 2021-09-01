import React from "react";
import { HStack, VStack, View, ScrollView } from "native-base";
import { useRecoilValue } from "recoil";
import patientState from "../recoil/patient/patientInfo";
import UserCard from "../components/home/UserCard";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";

const PatientInfo = (): JSX.Element => {
	const patientInfo = useRecoilValue(patientState);

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
						<ResourceCardItem label="Patient ID" isPatientInfoComponent={true}>{ patientInfo.id }</ResourceCardItem>
						<ResourceCardItem label="Date of Birthday" isPatientInfoComponent={true}>{ patientInfo.birthDate }</ResourceCardItem>
						<ResourceCardItem label="Gender Identity" isPatientInfoComponent={true}>{ patientInfo.gender }</ResourceCardItem>
						<ResourceCardItem label="Primary Language" isPatientInfoComponent={true}>{ patientInfo.language }</ResourceCardItem>
					</ResourceCard>
					<ResourceCard title="Contact Information">
						<ResourceCardItem label="Home Address" isPatientInfoComponent={true}>{ patientInfo.address }</ResourceCardItem>
						<ResourceCardItem label="Phone Number" isPatientInfoComponent={true}>{ patientInfo.phone }</ResourceCardItem>
						<ResourceCardItem label="Email Address" isPatientInfoComponent={true}>{ patientInfo.email }</ResourceCardItem>
						<ResourceCardItem label="Employment Status" isPatientInfoComponent={true}>{ patientInfo.employmentStatus }</ResourceCardItem>
					</ResourceCard>
					<ResourceCard title="Other Information">
						<ResourceCardItem label="Race" isPatientInfoComponent={true}>{ patientInfo.race }</ResourceCardItem>
						<ResourceCardItem label="Ethnicity" isPatientInfoComponent={true}>{ patientInfo.ethnicity }</ResourceCardItem>
						<ResourceCardItem label="Education Level" isPatientInfoComponent={true}>{ patientInfo.educationLevel }</ResourceCardItem>
						<ResourceCardItem label="Marital Status" isPatientInfoComponent={true}>{ patientInfo.maritalStatus }</ResourceCardItem>
					</ResourceCard>
				</VStack>
			</View>
		</ScrollView>
	);
};

export default PatientInfo;
