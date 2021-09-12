import ResourceCard from "../ResourceCard";
import ResourceCardItem from "../ResourceCardItem";
import { View } from "native-base";
import React from "react";
import { Referral } from "../../recoil/task/referral";
import moment from "moment";
import { checkValue } from "../../utils";


const ReferralInfoCard = ({ referral }: { referral: Referral }): JSX.Element => {
	const sentDate = referral.authoredOn ? moment(referral.authoredOn).format("MMM DD, YYYY, hh:mm A") : undefined;
	const occurrence = referral.serviceRequest?.occurrenceDateTime ? moment(referral.serviceRequest.occurrenceDateTime).format("MMM DD, YYYY, hh:mm A") : undefined;
	const requestDisplay = referral.serviceRequest?.code?.coding?.[0].display;
	const requestCode = referral.serviceRequest?.code?.coding?.[0].code;
	const request = `${requestDisplay} (${requestCode})`;
	const requestCategory = referral.serviceRequest?.category?.[0].coding?.[0].display;
	const sentBy = referral.requester?.display;
	const submitDate = referral.lastModified ? moment(referral.lastModified).format("MMM DD, YYYY, hh:mm A") : undefined;
	const { status } = referral;
	const isSubmitted = ["rejected", "cancelled", "on-hold", "failed", "completed", "entered-in-error"].includes(referral.status);

	return (
		<View mb={5}>
			<ResourceCard
				title={"Info"}
				badge={status}
			>
				<ResourceCardItem label="Sent Date">
					{ checkValue(sentDate) }
				</ResourceCardItem>
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
				<ResourceCardItem label="Category">
					{ checkValue(requestCategory) }
				</ResourceCardItem>
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

export default ReferralInfoCard;
