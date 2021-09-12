import React, {useEffect, useState} from "react";
import {HStack, VStack, View, ScrollView, Modal, Button, Icon} from "native-base";
import ProfileUserCard from "./ProfileUserCard";
import { useNavigation } from "@react-navigation/native";
import { Path } from "react-native-svg";
import PatientProfileTabs from "../../components/PatientProfileTabs";
import LogoutModalWindow from "../PatientProfile/LogoutModalWindow";

const PatientProfile = (): JSX.Element => {
	const navigation = useNavigation();
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		navigation.setOptions({ headerRight: () => (
			<Button
				bg="#fff"
				w="35px"
				p="10px"
				variant="unstyled"
				onPress={ () => setShowModal(!showModal) }
			>
				<Icon
					size={5}
					viewBox="0 0 20 20"
					fill="none"
				>
					<Path
						d="M8.18182 16C3.663 16 0 12.4184 0 8C0 3.5816 3.663 2.25463e-06 8.18182 2.25463e-06C9.45217 -0.000930914 10.7052 0.28782 11.8415 0.843315C12.9777 1.39881 13.9658 2.20574 14.7273 3.2H12.51C11.5652 2.38541 10.4001 1.85469 9.1544 1.67152C7.90875 1.48836 6.63551 1.66053 5.48745 2.16737C4.3394 2.67422 3.3653 3.49421 2.68206 4.52895C1.99881 5.56369 1.63544 6.76922 1.63554 8.00089C1.63565 9.23255 1.99923 10.438 2.68265 11.4727C3.36607 12.5073 4.34031 13.3271 5.48845 13.8338C6.63659 14.3404 7.90986 14.5124 9.15548 14.329C10.4011 14.1457 11.5661 13.6147 12.5108 12.8H14.7281C13.9666 13.7944 12.9783 14.6014 11.8419 15.1569C10.7055 15.7124 9.45231 16.0011 8.18182 16ZM13.9091 11.2V8.8H7.36364V7.2H13.9091V4.8L18 8L13.9091 11.2Z"
						fill="#0069FF"
					/>
				</Icon>
			</Button>
		)})
	}, [])

	return (
		<ScrollView
			flex={1}
			bg={"#F8F9FB"}
		>
			<VStack flex={1} space={5} p={5}>
				<View>
					<ProfileUserCard />
				</View>
				<View flex={1}>
					<PatientProfileTabs />
				</View>
			</VStack>
			<LogoutModalWindow isVisible={showModal} closeModal={ () => setShowModal(!showModal) } />
		</ScrollView>
	);
};

export default PatientProfile;
