import React from "react";
import { HStack, ScrollView, View } from "native-base";
import SyncInfo from "../components/home/SyncInfo";
import UserCard from "../components/home/UserCard";
import ClinicalStaffCard from "../components/home/ClinicalStaffCard";
import CaregiversCard from "../components/home/CaregiversCard";
import OrganizationsCard from "../components/home/OrganizationsCard";
import InsurancesCard from "../components/home/InsurancesCard";
import ReferralsCard from "../components/home/ReferralsCard";
import AssessmentsCard from "../components/home/AssessmentsCard";

const Home = (): JSX.Element => (
	<ScrollView
		pt={2}
		pb={2}
	>
		<HStack>
			<SyncInfo />
		</HStack>

		<View p={5}>
			<HStack pb={5}>
				<UserCard />
			</HStack>

			<HStack
				space={5}
				pb={5}
			>
				<ClinicalStaffCard />

				<CaregiversCard />
			</HStack>

			<HStack
				space={5}
				pb={5}
			>
				<OrganizationsCard />

				<InsurancesCard />
			</HStack>

			<HStack pb={5}>
				<ReferralsCard />
			</HStack>

			<HStack>
				<AssessmentsCard />
			</HStack>
		</View>
	</ScrollView>
);

export default Home;
