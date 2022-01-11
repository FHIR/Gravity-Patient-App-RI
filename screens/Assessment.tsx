import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Client from "fhir-kit-client";
import { QuestionnaireResponse, Task, TaskOutput } from "fhir/r4";
import moment from "moment";
import { Button, Divider, FormControl, HStack, ScrollView, Select, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { RootStackParamList } from "../App";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem from "../components/ResourceCardItem";
import { questRespState } from "../recoil/questResp";
import { useWithAccessToken } from "../recoil/servers";
import { taskAssessmentState } from "../recoil/task";
import { Assessment } from "../recoil/task/assessment";
import taskState from "../recoil/task/atom";
import { filterMap } from "../utils";

type Question = {
	linkId: string,
	text: string,
	required: boolean,
	type: "choice",
	options: {
		code: string,
		display: string,
		system?: string
	}[]
}

type Answer = {
	question: string,
	answer: string
}

type AnswerItem = {
	linkId: string,
	text?: string,
	answer?: {
		valueCoding?: {
			system?: string,
			code: string,
			display: string
		}
	}[]
}

type QuestionItem = {
	linkId: string,
	type: string,
	text?: string,
	required?: boolean,
	answerOption?: {
		valueCoding?: {
			system?: string,
			code: string,
			display: string
		}
	}[]
}


const createQuestionnaireResponse = (questionnaireURL: string, patientId: string, answers: AnswerItem[]) => ({
	resourceType: "QuestionnaireResponse",
	questionnaire: questionnaireURL,
	authored: new Date().toISOString(),
	subject: {
		"reference": `Patient/${patientId}`
	},
	source: {
		"reference": `Patient/${patientId}`
	},
	author: `Patient/${patientId}`,
	status: "completed",
	item: answers
});


const prepareQuestions = (item: QuestionItem[]): Question[] =>
	filterMap(item, ({ linkId, type, text, required, answerOption }) => {
		const options = answerOption && filterMap(answerOption, ({ valueCoding }) => valueCoding || false);
		if (type === "choice" && text && options && options.length > 0) {
			return {
				linkId,
				text,
				type,
				required: required || false,
				options
			};
		} else {
			return false;
		}
	});


const prepareAnswers = (item: AnswerItem[]): Answer[] =>
	filterMap(item, ({ text, answer }) => {
		const [answerText] = filterMap(answer || [], ans => ans.valueCoding?.display);
		if (!text || !answerText) {
			return false;
		}
		return {
			question: text,
			answer: answerText
		};
	});



const AssessmentScreen = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, "Assessment">) => {
	const { assessmentId: [serverId, id] } = route.params;

	const assessments = useRecoilValue(taskAssessmentState);
	const assessment = assessments.find(({ id: [sid, aid] }) => sid === serverId && aid === id);

	const title = assessment?.task?.description || "untitled assessment";
	useEffect(() => {
		navigation.setOptions({ title });
	}, [title]);

	return assessment ? (
		assessment.response ?
			<CompleteAssessment assessment={assessment} response={assessment.response} />
			:
			<UncompleteAssessment assessment={assessment} />
	) : <></>;
};


const UncompleteAssessment = ({ assessment: asm }: { assessment: Assessment }) => {
	const withAccessToken = useWithAccessToken();
	const questions = prepareQuestions((asm.questionnaire.item || []) as QuestionItem[]);
	const [answers, setAnswers] = useState<{ [id: string]: string | undefined }>({});
	const [atRisk, setAtRisk] = useState<boolean | "">("");
	const executionPeriod = asm.task?.executionPeriod;
	const dueDate = !executionPeriod ? undefined : (executionPeriod?.start ?
		`from ${moment(executionPeriod?.end).format("MMM DD, YYYY")} to ${moment(executionPeriod?.end).format("MMM DD, YYYY")}` :
		moment(executionPeriod?.end).format("MMM DD, YYYY"));

	const setAnswer = (id: string, resp: string | undefined) => {
		setAnswers(old => ({ ...old, [id]: resp }));
	};

	useEffect(() => {
		setAtRisk(answers?.["/88122-7"] === "LA28397-0" || answers?.["/88122-7"] === "LA6729-3" || answers?.["/88123-5"] === "LA28397-0" || answers?.["/88123-5"] === "LA6729-3");
	}, [answers]);

	useEffect(() => {
		atRisk ? setAnswers(old => ({ ...old, ["/88124-3"]: "LA19952-3" })) : setAnswers(old => ({ ...old, ["/88124-3"]: "LA19983-8" }));
	}, [atRisk]);

	const valid = questions.every(({ linkId, required }) => !required || answers[linkId] !== undefined);

	const prepareAnswers = (): AnswerItem[] => filterMap(questions, ({ linkId, options, text }) => {
		const answeredCode = answers[linkId];
		const answerCoding = answeredCode ? options.find(({ code }) => code === answeredCode) : undefined;
		if (!answerCoding) {
			return false;
		}
		return {
			linkId,
			text,
			answer: [{
				valueCoding: {
					...answerCoding,
					system: "http://loinc.org"
				}
			}]
		};
	});

	const [sendingResponse, setSendingResponse] = useState(false);

	const [tasks, setTasks] = useRecoilState(taskState);
	const [questResps, setQuestResps] = useRecoilState(questRespState);

	const onSubmit = () => {
		setSendingResponse(true);
		withAccessToken(asm.id[0], async (token, patientId, fhirUri) => {
			const client = new Client({ baseUrl: fhirUri });
			client.bearerToken = token;
			const result = await client.create({
				resourceType: "QuestionnaireResponse",
				body: createQuestionnaireResponse(asm.questionnaire?.url, patientId, prepareAnswers())
			}) as QuestionnaireResponse;
			setQuestResps(old => ({
				...old,
				[asm.id[0]]: [...(old[asm.id[0]] || []), result]
			}));
			const output: TaskOutput =  {
				type: {
					coding: [{
						system: "http://hl7.org/fhir/uv/sdc/CodeSystem/temp",
						code: "questionnaire-response",
						display: "Questionnaire Response"
					}]
				},
				valueReference: {
					reference: `QuestionnaireResponse/${result.id}`
				}
			};
			const newTask = await client.update({
				resourceType: "Task",
				id: asm.task.id!,
				body: {
					...asm.task,
					status: "completed",
					output: [output]
				}
			}) as Task;
			setTasks(old => ({
				...old,
				[asm.id[0]]: old[asm.id[0]]?.map(task => task.id === newTask.id ? newTask : task) || []
			}));
		});
	};

	return (
		<ScrollView>
			<VStack p={5} space={5}>
				<ResourceCard title="Info" badge={ asm.task.status === "cancelled" ? "cancelled" : "new"}>
					<ResourceCardItem label="Request Date">
						{asm.sentDate || "N/A"}
					</ResourceCardItem>
					<ResourceCardItem label="Sent By">
						{asm.requesterName || "N/A"}
					</ResourceCardItem>
					<ResourceCardItem label="Due Date">
						{dueDate || "N/A"}
					</ResourceCardItem>
					<ResourceCardItem label="Organization">
						{asm.serverTitle}
					</ResourceCardItem>
					{asm.task.status === "cancelled" ?
						<ResourceCardItem label="Cancelled Reason">
							{asm.task.statusReason?.text || "N/A" }
						</ResourceCardItem> : <></>}
				</ResourceCard>

				{ asm.task.status !== "cancelled" ?
					<ResourceCard title="Question - Answer Pairs">
						<VStack space={5} divider={<Divider />}>
							{questions.map(q => (
								<VStack key={q.linkId} space={4}>
									<VStack space={2}>
										<Text
											fontSize="sm"
											color="#7b7f87"
										>
										Question
										</Text>
										<Text>
											{q.text}
										</Text>
									</VStack>

									<FormControl>
										<FormControl.Label>
											<Text
												fontSize="sm"
												color="#7b7f87"
											>
											Response:
											</Text>
										</FormControl.Label>
										<Select
											selectedValue={answers[q.linkId]}
											onValueChange={resp => setAnswer(q.linkId, resp)}
											accessibilityLabel="Choose response"
											placeholder="Choose response"
											placeholderTextColor="#828282"
											isDisabled={q.linkId === "/88124-3" }
										>
											{q.options.map(({ display, code }) => <Select.Item key={code} label={display} value={code} />)}
										</Select>
									</FormControl>
								</VStack>
							))}
						</VStack>
					</ResourceCard> : <></> }
				{asm.task.status !== "cancelled" ?
					<HStack space={4}>
						{/* <Button
						flex={1}
						variant="outline"
						colorScheme="dark"
					>
						Save
					</Button> */}
						<Button
							flex={1}
							colorScheme="blue"
							disabled={!valid}
							onPress={onSubmit}
							isLoading={sendingResponse}
						>
							Submit
						</Button>
					</HStack> : <></>}
			</VStack>
		</ScrollView>
	);
};

const CompleteAssessment = ({ assessment: asm, response }: { assessment: Assessment, response: QuestionnaireResponse }) => {
	const submitDate = response.authored ? moment(response.authored).format("MMM DD, YYYY, hh:mm A") : undefined;
	const items = response.item as AnswerItem[];
	const answers = prepareAnswers(items);

	return (
		<ScrollView>
			<VStack p={5} space={5}>
				<ResourceCard title="Info" badge={asm.task.status === "cancelled" ? "cancelled" : "Submitted"}>
					<ResourceCardItem label="Request Date">
						{asm.sentDate || "N/A"}
					</ResourceCardItem>
					<ResourceCardItem label="Sent By">
						{asm.requesterName || "N/A"}
					</ResourceCardItem>
					<ResourceCardItem label="Submit Date">
						{submitDate || "N/A"}
					</ResourceCardItem>
					<ResourceCardItem label="Organization">
						{asm.serverTitle}
					</ResourceCardItem>
				</ResourceCard>

				<ResourceCard title="Question - Answer Pairs">
					<VStack space={5} divider={<Divider />}>
						{answers.map((q, id) => (
							<VStack key={id} space={4}>
								<VStack space={2}>
									<Text
										fontSize="sm"
										color="#7b7f87"
									>
										Question
									</Text>
									<Text>
										{q.question}
									</Text>
								</VStack>

								<VStack space={2}>
									<Text
										fontSize="sm"
										color="#7b7f87"
									>
										Response
									</Text>
									<Text>
										{q.answer}
									</Text>
								</VStack>
							</VStack>
						))}
					</VStack>
				</ResourceCard>
			</VStack>
		</ScrollView>
	);
};
export default AssessmentScreen;
