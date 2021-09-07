import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { filterNewTasks, filterInProgressTasks, filterSubmittedTasks } from "../utils";
import { useRecoilValue } from "recoil";
import { taskReferralState } from "../recoil/task";
import ReferralList from "../components/referrals/ReferralList";
import { Referral } from "../recoil/task/referral";

const Tab = createMaterialTopTabNavigator();

const New = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const newReferrals = filterNewTasks(referrals) as Referral[];

	return <ReferralList referrals={newReferrals} status="new" />;
};

const InProgress = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const inProgressReferrals = filterInProgressTasks(referrals) as Referral[];

	return <ReferralList referrals={inProgressReferrals} status="in-progress" />;
};

const Submitted = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const submittedReferrals = filterSubmittedTasks(referrals) as Referral[];

	return <ReferralList referrals={submittedReferrals} status={"submitted"} />;
};

const Referrals = (): JSX.Element => (
	<Tab.Navigator>
		<Tab.Screen name="New" component={New} />
		<Tab.Screen name="In Progress" component={InProgress} />
		<Tab.Screen name="Submitted" component={Submitted} />
	</Tab.Navigator>
);

export default Referrals;
