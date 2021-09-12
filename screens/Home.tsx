import React, { useEffect, useState } from "react";
import { HStack, ScrollView, View, Text, Pressable, Spinner } from "native-base";
import SyncInfo from "../components/home/SyncInfo";
import UserCard from "../components/home/UserCard";
import ClinicalStaffCard from "../components/home/ClinicalStaffCard";
import CaregiversCard from "../components/home/CaregiversCard";
import OrganizationsCard from "../components/home/OrganizationsCard";
import InsurancesCard from "../components/home/InsurancesCard";
import ReferralsCard from "../components/home/ReferralsCard";
import AssessmentsCard from "../components/home/AssessmentsCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { Server, serversState, useWithAccessToken } from "../recoil/servers";
import patientState from "../recoil/patient";
import coverageState from "../recoil/coverage";
import payorState from "../recoil/payor";
import ownerState from "../recoil/owner";
import taskState from "../recoil/task";
import focusState from "../recoil/focus";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { fetchFhirData } from "../utils/api";
import { questRespState } from "../recoil/questResp";
import moment from "moment";


const Home = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">): JSX.Element => {
	const [servers, setServers] = useRecoilState(serversState);
	const [patients, setPatient] = useRecoilState(patientState);
	const [coverages, setCoverage] = useRecoilState(coverageState);
	const [payors, setPayor] = useRecoilState(payorState);
	const [owners, setOwner] = useRecoilState(ownerState);
	const [tasks, setTask] = useRecoilState(taskState);
	const [focuses, setFocus] = useRecoilState(focusState);
	const [questResps, setQuestResps] = useRecoilState(questRespState);
	const [isLoading, setIsLoading] = useState(false);

	const withAccessToken = useWithAccessToken();

	const fetchServer = (serverId: string) => {
		setIsLoading(true);

		try {
			withAccessToken(serverId, async (token, patientId, fhirUri) => {
				const { patient, coverage, payor, owner, task, focus } = await fetchFhirData(fhirUri, token, patientId);
				patient && setPatient({
					...patients,
					[serverId]: patient
				});
				coverage && setCoverage({
					...coverages,
					[serverId]: coverage
				});
				payor && setPayor({
					...payors,
					[serverId]: payor
				});
				owner && setOwner({
					...owners,
					[serverId]: owner
				});
				task && setTask({
					...tasks,
					[serverId]: task
				});
				focus && setFocus({
					...focuses,
					[serverId]: focus
				});
				setServers({
					...servers,
					[serverId]: {
						...servers[serverId],
						lastUpdated: moment.utc().format()
					}
				});
			});
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchData = async () => {
		Object.keys(servers).forEach(serverId => {
			const server = servers[serverId];
			fetchServer(serverId);
		});
	};

	useEffect(() => {
		//todo: hmmmm, think about fetching data on every home screen entrance, seems not right
		fetchData();
	}, []);

	const handleSync = () => {
		fetchData();
	};

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
				<SyncInfo onSync={handleSync} />
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
					<Pressable
						flex={1}
						flexDirection="column"
						onPress={() => navigation.navigate("Referrals")}
					>
						<ReferralsCard />
					</Pressable>
				</HStack>

				<HStack>
					<Pressable
						flex={1}
						flexDirection="column"
						onPress={() => navigation.navigate("Assessments")}
					>
						<AssessmentsCard/>
					</Pressable>
				</HStack>
			</View>

			{ isLoading &&
				<View
					alignItems="center"
					justifyContent="center"
					position="absolute"
					top={0}
					right={0}
					bottom={0}
					left={0}
					backgroundColor="#F5FCFF88"
				>
					<Spinner color="blue.500" />
				</View>
			}
		</ScrollView>
	);
};

export default Home;
