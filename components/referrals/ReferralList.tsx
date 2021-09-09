import { Pressable, ScrollView, Text, View } from "native-base";
import ReferralListItem from "./ReferralListItem";
import React from "react";
import { Referral } from "../../recoil/task/referral";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";


const ReferralList = ({ referrals } : { referrals: Referral[] }): JSX.Element => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	return (
		<ScrollView p={5}>
			{
				referrals.length ?
					referrals.map((r, i) => (
						<Pressable
							onPress={() => navigation.navigate("ReferralView", { referralId: r.id })}
							key={i}
						>
							<ReferralListItem referral={r} />
						</Pressable>
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
