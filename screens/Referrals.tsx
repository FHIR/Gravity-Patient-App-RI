import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { filterNewTasks, filterInProgressTasks, filterSubmittedTasks } from "../utils";
import { useRecoilValue } from "recoil";
import { taskReferralState } from "../recoil/task";
import ReferralList from "../components/referrals/ReferralList";
import { Referral } from "../recoil/task/referral";
import taskMakeContactState from "../recoil/task/makeContact";

const Tab = createMaterialTopTabNavigator();

const New = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const makeContact = useRecoilValue(taskMakeContactState);
	const newReferrals = filterNewTasks([...referrals, ...makeContact]) as Referral[];

	return <ReferralList referrals={newReferrals} />;
};

const InProgress = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const makeContact = useRecoilValue(taskMakeContactState);
	const inProgressReferrals = filterInProgressTasks([...referrals, ...makeContact]) as Referral[];

	return <ReferralList referrals={inProgressReferrals} />;
};

const Submitted = (): JSX.Element => {
	const referrals = useRecoilValue(taskReferralState);
	const makeContact = useRecoilValue(taskMakeContactState);
	const submittedReferrals = filterSubmittedTasks([...referrals, ...makeContact]) as Referral[];

	return <ReferralList referrals={submittedReferrals} />;
};

const Referrals = (): JSX.Element => (
	<Tab.Navigator>
		<Tab.Screen name="New" component={New} />
		<Tab.Screen name="In Progress" component={InProgress} />
		<Tab.Screen name="Submitted" component={Submitted} />
	</Tab.Navigator>
);

export default Referrals;
