import ResourceCard from "../ResourceCard";
import ResourceCardItem from "../ResourceCardItem";
import { View } from "native-base";
import React from "react";
import { Referral } from "../../recoil/task/referral";
import moment from "moment";
import { checkValue } from "../../utils";


const ReferralListItem = ({ referral }: { referral: Referral }): JSX.Element => {
	const name = referral.code?.text;
	const occurrence = referral.serviceRequest?.occurrenceDateTime ? moment(referral.serviceRequest.occurrenceDateTime).format("MMM DD, YYYY, hh:mm A") : undefined;
	const requestDisplay = referral.serviceRequest?.code?.coding?.[0].display;
	const requestCode = referral.serviceRequest?.code?.coding?.[0].code;
	const request = `${requestDisplay} (${requestCode})`;
	const sentBy = referral.requester?.display;
	const submitDate = referral.lastModified ? moment(referral.lastModified).format("MMM DD, YYYY, hh:mm A") : undefined;
	const isSubmitted = ["rejected", "cancelled", "on-hold", "failed", "completed", "entered-in-error"].includes(referral.status);

	return (
		<View mb={5}>
			<ResourceCard title={ checkValue(name) }>
				{
					isSubmitted
						?
						<ResourceCardItem label="Submit Date">
							{ checkValue(submitDate) }
						</ResourceCardItem>
						:
						<ResourceCardItem label="Occurrence">
							{ checkValue(occurrence) }
						</ResourceCardItem>
				}
				<ResourceCardItem label="Request">
					{ checkValue(request) }
				</ResourceCardItem>
				<ResourceCardItem label="Sent By">
					{ checkValue(sentBy) }
				</ResourceCardItem>
			</ResourceCard>
		</View>
	);
};

export default ReferralListItem;
