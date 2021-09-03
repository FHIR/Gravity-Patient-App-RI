import React, { useEffect } from "react";
import { HStack, ScrollView, View, Text, Pressable } from "native-base";
import SyncInfo from "../components/home/SyncInfo";
import UserCard from "../components/home/UserCard";
import ClinicalStaffCard from "../components/home/ClinicalStaffCard";
import CaregiversCard from "../components/home/CaregiversCard";
import OrganizationsCard from "../components/home/OrganizationsCard";
import InsurancesCard from "../components/home/InsurancesCard";
import ReferralsCard from "../components/home/ReferralsCard";
import AssessmentsCard from "../components/home/AssessmentsCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { serversState } from "../recoil/servers";
import patientState from "../recoil/patient";
import coverageState from "../recoil/coverage";
import payorState from "../recoil/payor";
import requesterState from "../recoil/requester";
import taskState from "../recoil/task";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { fetchFhirData } from "../utils/api";

const Home = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">): JSX.Element => {
	const servers = useRecoilValue(serversState);
	const [patients, setPatient] = useRecoilState(patientState);
	const [coverages, setCoverage] = useRecoilState(coverageState);
	const [payors, setPayor] = useRecoilState(payorState);
	const [requesters, setRequester] = useRecoilState(requesterState);
	const [tasks, setTask] = useRecoilState(taskState);

	useEffect(() => {
		Object.keys(servers).forEach(key => {
			const server = servers[key];

			server && server.session && fetchFhirData(server.fhirUri, server.session.token.access, server.session.patientId).then(({ patient, coverage, payor, requester, task })  => {
				patient && setPatient([...patients, patient]);
				coverage && setCoverage([...coverages, ...coverage]);
				payor && setPayor([...payors, ...payor]);
				requester && setRequester([...requesters, ...requester]);
				task && setTask([...tasks, ...task]);
			})
		});
	}, [servers]);

	if (!Object.keys(servers).length) {
		return (
			<View flex={1} alignItems="center" justifyContent="center">
				<Text>No Data Yet</Text>
			</View>
		);
	}

	return (
		<ScrollView
			pt={2}
			pb={2}
		>
			<HStack>
				<SyncInfo/>
			</HStack>
			<View p={5}>
				<HStack pb={5}>
					<Pressable
						flex={1}
						flexDirection="column"
						onPress={() => navigation.navigate("PatientProfile")}
					>
						<UserCard/>
					</Pressable>
				</HStack>

				<HStack
					space={5}
					pb={5}
				>
					<Pressable
						flex={1}
						flexDirection="row"
						onPress={() => navigation.navigate("ClinicalStaff")}
					>
						<ClinicalStaffCard />
					</Pressable>

					<Pressable
						flex={1}
						flexDirection="row"
						onPress={() => navigation.navigate("Caregivers")}
					>
						<CaregiversCard />
					</Pressable>
				</HStack>

				<HStack
					space={5}
					pb={5}
				>
					<Pressable
						flex={1}
						flexDirection="row"
						onPress={() => navigation.navigate("Organizations")}
					>
						<OrganizationsCard />
					</Pressable>

					<Pressable
						flex={1}
						flexDirection="row"
						onPress={() => navigation.navigate("Insurances")}
					>
						<InsurancesCard />
					</Pressable>
				</HStack>

				<HStack pb={5}>
					<ReferralsCard/>
				</HStack>

				<HStack>
					<AssessmentsCard/>
				</HStack>
			</View>
		</ScrollView>
	);
};

export default Home;
