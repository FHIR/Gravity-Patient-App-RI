import { ScrollView, Text, View } from "native-base";
import ReferralListItem from "./ReferralListItem";
import React from "react";
import { Referral } from "../../recoil/task/referral";


const ReferralList = ({ referrals, status } : { referrals: Referral[], status: "new" | "in-progress" | "submitted" }): JSX.Element => {
	return (
		<ScrollView p={5}>
			{
				referrals.length ?
					referrals.map((r, i) => (
						<ReferralListItem
							referral={r}
							status={status}
							key={i}
						/>
					)) :
					<View
						flex={1}
						alignItems="center"
					>
						<Text>No Data Yet</Text>
					</View>
			}
		</ScrollView>
	);
};

export default ReferralList;
