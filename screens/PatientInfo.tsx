import React from "react";
import {Avatar, HStack, Text, VStack, View, Heading, ScrollView } from "native-base";
import Card from "../components/Card";
import { useRecoilValue } from "recoil";
import currentPatientInfoState from "../recoil/patient/patientInfo";

const PatientInfo = ():JSX.Element => {
	const currentPatientInfo = useRecoilValue(currentPatientInfoState);

	return (
		<ScrollView
			pt={2}
			pb={2}
		>
			<View p={5}>
				<HStack pb={5}>
					<Card>
						<HStack alignItems="center">
							<Avatar size="55px">User</Avatar>
							<VStack ml={4}>
								<Text
									color="#333"
									fontSize="lg"
								>
									{currentPatientInfo.name}
								</Text>
								<Text
									color="#7b7f87"
									fontSize="sm"
								>
									{currentPatientInfo.email}
								</Text>
							</VStack>
						</HStack>
					</Card>
				</HStack>
				<VStack space={5}>
					<Card>
						<VStack>
							<Heading
								fontWeight="500"
								fontSize="lg"
								mb={15}
							>
								Primary Information
							</Heading>
							<HStack space={5} pb={5}>
								<View
									flex={1}
									flexDirection="row">
									<Text
										color="#7b7f87"
										fontSize="sm"
									>
										Patient ID:
									</Text>
								</View>
								<View
									flex={1}
									flexDirection="row">
									<Text fontSize="sm">{currentPatientInfo.id}</Text>
								</View>
							</HStack>

							<HStack space={5} pb={5}>
								<View
									flex={1}
									flexDirection="row">
									<Text
										color="#7b7f87"
										fontSize="sm"
									>
										Date of Birthday:
									</Text>
								</View>
								<View
									flex={1}
									flexDirection="row">
									<Text fontSize="sm">{currentPatientInfo.birthDate}</Text>
								</View>
							</HStack>

							<HStack space={5} pb={5}>
								<View
									flex={1}
									flexDirection="row">
									<Text
										color="#7b7f87"
										fontSize="sm"
									>
										Gender Identity:
									</Text>
								</View>
								<View
									flex={1}
									flexDirection="row">
									<Text fontSize="sm">{currentPatientInfo.gender}</Text>
								</View>
							</HStack>

							<HStack space={5}>
								<View
									flex={1}
									flexDirection="row">
									<Text
										color="#7b7f87"
										fontSize="sm"
									>
										Primary Language:
									</Text>
								</View>
								<View
									flex={1}
									flexDirection="row">
									<Text fontSize="sm">{currentPatientInfo.language}</Text>
								</View>
							</HStack>
						</VStack>
					</Card>
					<Card>
						<VStack>
								<Heading
									fontWeight="500"
									fontSize="lg"
									mb={15}
								>
									Contact Information
								</Heading>
								<HStack space={5} pb={5}>
									<View
										flex={1}
										flexDirection="row">
										<Text
											color="#7b7f87"
											fontSize="sm"
										>
											Home Address:
										</Text>
									</View>
									<View
										flex={1}
										flexDirection="row">
										<Text fontSize="sm">{currentPatientInfo.address}</Text>
									</View>
								</HStack>

								<HStack space={5} pb={5}>
									<View
										flex={1}
										flexDirection="row">
										<Text
											color="#7b7f87"
											fontSize="sm"
										>
											Phone Number:
										</Text>
									</View>
									<View
										flex={1}
										flexDirection="row">
										<Text fontSize="sm">{currentPatientInfo.phone}</Text>
									</View>
								</HStack>

								<HStack space={5} pb={5}>
									<View
										flex={1}
										flexDirection="row">
										<Text
											color="#7b7f87"
											fontSize="sm"
										>
											Email Address:
										</Text>
									</View>
									<View
										flex={1}
										flexDirection="row">
										<Text fontSize="sm">{currentPatientInfo.email}</Text>
									</View>
								</HStack>

								<HStack space={5}>
									<View
										flex={1}
										flexDirection="row">
										<Text
											color="#7b7f87"
											fontSize="sm"
										>
											Employment Status:
										</Text>
									</View>
									<View
										flex={1}
										flexDirection="row">
										<Text fontSize="sm">N/A</Text>
									</View>
								</HStack>
							</VStack>
					</Card>
					<Card>
						<VStack>
								<Heading
									fontWeight="500"
									fontSize="lg"
									mb={15}
								>
									Other Information
								</Heading>
								<HStack space={5} pb={5}>
									<View
										flex={1}
										flexDirection="row">
										<Text
											color="#7b7f87"
											fontSize="sm"
										>
											Race:
										</Text>
									</View>
									<View
										flex={1}
										flexDirection="row"
									>
										<Text fontSize="sm"
										>
											N/A
										</Text>
									</View>
								</HStack>

								<HStack space={5} pb={5}>
									<View
										flex={1}
										flexDirection="row">
										<Text
											color="#7b7f87"
											fontSize="sm"
										>
											Ethnicity:
										</Text>
									</View>
									<View
										flex={1}
										flexDirection="row"
									>
										<Text fontSize="sm">N/A</Text>
									</View>
								</HStack>

								<HStack space={5} pb={5}>
									<View
										flex={1}
										flexDirection="row">
										<Text
											color="#7b7f87"
											fontSize="sm"
										>
											Education Level:
										</Text>
									</View>
									<View
										flex={1}
										flexDirection="row"
									>
										<Text fontSize="sm">N/A</Text>
									</View>
								</HStack>

								<HStack space={5}>
									<View
										flex={1}
										flexDirection="row">
										<Text
											color="#7b7f87"
											fontSize="sm"
										>
											Marital Status:
										</Text>
									</View>
									<View
										flex={1}
										flexDirection="row"
									>
										<Text fontSize="sm">{currentPatientInfo.maritalStatus}</Text>
									</View>
								</HStack>
							</VStack>
					</Card>
				</VStack>
			</View>
		</ScrollView>
	);
};

export default PatientInfo;
