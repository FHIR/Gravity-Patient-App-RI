import React, {useEffect} from "react";
import { HStack, ScrollView, View, Text } from "native-base";
import SyncInfo from "../components/home/SyncInfo";
import UserCard from "../components/home/UserCard";
import ClinicalStaffCard from "../components/home/ClinicalStaffCard";
import CaregiversCard from "../components/home/CaregiversCard";
import OrganizationsCard from "../components/home/OrganizationsCard";
import InsurancesCard from "../components/home/InsurancesCard";
import ReferralsCard from "../components/home/ReferralsCard";
import AssessmentsCard from "../components/home/AssessmentsCard";
import { useRecoilState } from "recoil";
import { serversState } from "../recoil/servers";
import patientState from "../recoil/patient";
import Client from "fhir-kit-client";

const Home = (): JSX.Element => {
	const [servers] = useRecoilState(serversState);
	const [patients, setPatient] = useRecoilState(patientState);

	useEffect(() => {
		Object.keys(servers).forEach(key => {
			const server = servers[key];

			server && server.session && getPatient(server.fhirUri, server.session.token.access, server.session.patientId);
		});
	},[servers])

	const getPatient = async (serverURI, token, id) => {
		const client = new Client({ baseUrl: serverURI });
		client.bearerToken = token;

		try {
			const patient = await client.read({ resourceType: "Patient", id });
			console.log("got patient", patient);
			setPatient([...patients, patient]);
		} catch (e) {
			console.log(e);
		}
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
				<SyncInfo/>
			</HStack>

			<View p={5}>
				<HStack pb={5}>
					<UserCard/>
				</HStack>

				<HStack
					space={5}
					pb={5}
				>
					<ClinicalStaffCard/>

					<CaregiversCard/>
				</HStack>

				<HStack
					space={5}
					pb={5}
				>
					<OrganizationsCard/>

					<InsurancesCard/>
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
}

export default Home;
