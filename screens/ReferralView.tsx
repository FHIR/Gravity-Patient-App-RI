import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useRecoilValue } from "recoil";
import { taskReferralState } from "../recoil/task";
import React, { useEffect } from "react";
import { ScrollView, Text } from "native-base";

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
			<ScrollView>
				<Text>{ JSON.stringify(referral, null, 4) }</Text>
			</ScrollView>
			:
			<></>
	);
};

export default ReferralView;
