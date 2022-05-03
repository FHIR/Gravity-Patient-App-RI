import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useRecoilValue } from "recoil";
import { taskReferralState } from "../recoil/task";
import React, { useEffect } from "react";
import { ScrollView, View } from "native-base";
import ReferralInfoCard from "../components/referrals/ReferralInfoCard";
import ReferralOutcome from "../components/referrals/ReferralOutcome";
import taskMakeContactState from "../recoil/task/makeContact";
import MakeContactOutcome from "../components/referrals/MakeContactOutcome";


const ReferralView = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, "ReferralView">): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const makeContact = useRecoilValue(taskMakeContactState);
	const referral =  [...referrals, ...makeContact].find(r => r.id === route.params.referralId);
	const pageTitle = referral?.description || "";

	useEffect(() => {
		navigation.setOptions({ title: pageTitle });
	}, ["pageTitle"]);

	const isMakeContact = referral?.input?.some(item => item.type?.coding?.[0]?.code === "contact-entity");

	return (
		referral
			?
			<ScrollView>
				<View p={5}>
					<ReferralInfoCard referral={referral} />
					{ isMakeContact
					?	<MakeContactOutcome task={referral} />
					:	<ReferralOutcome referral={referral} />
					}
				</View>
			</ScrollView>
			:
			<></>
	);
};

export default ReferralView;
