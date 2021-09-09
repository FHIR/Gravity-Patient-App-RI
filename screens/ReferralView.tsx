import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useRecoilValue } from "recoil";
import { taskReferralState } from "../recoil/task";
import React, { useEffect } from "react";
import { ScrollView } from "native-base";
import ReferralInfoCard from "../components/referrals/ReferralInfoCard";
import ReferralOutcome from "../components/referrals/ReferralOutcome";


const ReferralView = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, "ReferralView">): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const referral =  referrals.find(r => r.id === route.params.referralId);
	const pageTitle = referral?.code?.text || "";

	useEffect(() => {
		navigation.setOptions({ title: pageTitle });
	}, ["pageTitle"]);

	return (
		referral
			?
			<ScrollView p={5}>
				<ReferralInfoCard referral={referral} />
				<ReferralOutcome referral={referral} />
			</ScrollView>
			:
			<></>
	);
};

export default ReferralView;
