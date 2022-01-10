import ResourceCard from "../ResourceCard";
import ResourceCardItem from "../ResourceCardItem";
import { View } from "native-base";
import React from "react";
import moment from "moment";
import { checkValue } from "../../utils";
import { getServiceRequestData } from "./ReferralInfoCard";
import { Task } from "fhir/r4";

const ReferralListItem = ({ referral }: { referral: Task }): JSX.Element => {
	const name = referral.description;
	const { occurrence, requestDisplay, requestCode } = getServiceRequestData(referral);
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
