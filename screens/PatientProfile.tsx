import React from "react";
import { HStack, View, ScrollView } from "native-base";
import ProfileUserCard from "../components/home/ProfileUserCard";

const PatientProfile = (): JSX.Element => {
	return (
		<ScrollView
			pt={2}
			pb={2}
		>
			<View p={5}>
				<HStack pb={5}>
					<ProfileUserCard />
				</HStack>
			</View>
		</ScrollView>
	);
};

export default PatientProfile;
