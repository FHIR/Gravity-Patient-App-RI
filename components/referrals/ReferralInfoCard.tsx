import ResourceCard from "../ResourceCard";
import ResourceCardItem from "../ResourceCardItem";
import {Text, View} from "native-base";
import React from "react";
import moment from "moment";
import { Task } from "fhir/r4";
import { checkValue } from "../../utils";
import taskState from "../../recoil/task";
import { focusServiceRequestState } from "../../recoil/focus";
import { useRecoilValue } from "recoil";

export const getServiceRequestData = (referral: Task) => {
	const tasks = Object.entries(useRecoilValue(taskState)).flatMap(v => v[1].map(t => ({ ...t, serverId: v[0] })));
	const taskId = referral.partOf?.[0].reference?.split("/")[1];
	const task = tasks.find(task => task.id === taskId);
	const serviceRequestId = task?.focus?.reference?.split("/")[1] || "";
	const serviceRequest = useRecoilValue(focusServiceRequestState)?.find(sr => sr.id === serviceRequestId);

	const occurrence = serviceRequest?.occurrenceDateTime ? moment(serviceRequest.occurrenceDateTime).format("MMM DD, YYYY, hh:mm A") : undefined;
	const requestDisplay = serviceRequest?.code?.coding?.[0].display;
	const requestCode = serviceRequest?.code?.coding?.[0].code;
	const requestCategory = serviceRequest?.category?.[0].coding?.[0].display;

	return { occurrence, requestDisplay, requestCode, requestCategory };
};

const ReferralInfoCard = ({ referral }: { referral: Task }): JSX.Element => {
	const sentDate = referral.authoredOn ? moment(referral.authoredOn).format("MMM DD, YYYY, hh:mm A") : undefined;
	const { occurrence, requestDisplay, requestCode, requestCategory } = getServiceRequestData(referral);
	const request = `${requestDisplay} (${requestCode})`;
	const sentBy = referral.requester?.display;
	const submitDate = referral.lastModified ? moment(referral.lastModified).format("MMM DD, YYYY, hh:mm A") : undefined;
	const { status } = referral;
	const isSubmitted = ["rejected", "cancelled", "on-hold", "failed", "completed", "entered-in-error"].includes(status);

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
				{ (referral.status === "ready" || referral.status === "in-progress") && referral.note?.length &&
					<ResourceCardItem label="Comment">
						{ referral.note?.map((comment, i) => (
							<Text
								key={i}
								color="#333333"
								fontSize="sm"
							>
								{comment.text}
							</Text>
						)) }
					</ResourceCardItem>
				}
			</ResourceCard>
		</View>
	);
};

export default ReferralInfoCard;
