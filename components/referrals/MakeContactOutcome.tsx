import { FormControl, VStack, Select, Text, TextArea, View, Button, Radio, Input, Divider } from "native-base";
import React, { useState, useEffect } from "react";
import Card from "../Card";
import { useRecoilState } from "recoil";
import { useWithAccessToken } from "../../recoil/servers";
import Client from "fhir-kit-client";
import { QuestionnaireResponse, Task, TaskOutput, Annotation } from "fhir/r4";
import taskState from "../../recoil/task";
import patientState from "../../recoil/patient";


const MakeContactOutcome = ({ task }: { task: Task }) => {
	const status = task.status;

	const isNotFinished = status === "ready" || status === "in-progress";

	return (
		status === "cancelled"
		? <Cancelled task={task} />
		: status === "completed"
		? <Completed task={task} />
		: isNotFinished ? <NotFinished task={task} taskStatus={status} />
		: <Card>Unexpected status</Card>
	);
};


const STATES = [
	{ label: "Yes", value: "yes" },
	{ label: "In progress", value: "in-progress" },
	{ label: "Do not intend to", value: "do-not-intend-to" },
] as const;

type State = "" | typeof STATES[number]["value"]

const NotFinished = ({ task, taskStatus }: { task: Task, taskStatus: "ready" | "in-progress" }) => {
	const initState = taskStatus === "ready" ? "" : "in-progress";
	const [state, setState] = useState<State>(initState);

	return (
		state === ""
		? <Ready changeState={setState} />
		: state === "in-progress"
		? <InProgress changeState={setState} statusChanged={initState !== state} task={task} />
		: state === "yes"
		? <Yes task={task} changeState={setState} />
		: <DoNotIntend task={task} changeState={setState} />
	);
};

const Ready = ({ changeState }: { changeState: (s: State) => void }) => {
	const state: State = "";

	return (
		<View>
			<VStack space={5}>
				<Card>
					<Text
						color="#464953"
						fontSize="lg"
						fontWeight="medium"
						mb={5}
					>
						Have you contacted the service provider organization?
					</Text>

					<FormControl>
						<FormControl.Label>
							<Text
								fontSize="sm"
								color="#7b7f87"
							>
								Status:
							</Text>
						</FormControl.Label>
						<Select
							selectedValue={state}
							onValueChange={val => changeState(val as State)}
							accessibilityLabel="Select status"
							placeholder="Select status"
							placeholderTextColor="#828282"
						>
							{STATES.map(({ label, value }) => <Select.Item key={value} label={label} value={value} />)}
						</Select>
					</FormControl>
				</Card>
				<Button
					flex={1}
					onPress={() => {}}
					colorScheme="blue"
					disabled={true}
				>
					Submit
				</Button>
			</VStack>
		</View>
	);
};

const InProgress = ({ changeState, statusChanged, task }: {
	task: Task,
	statusChanged: boolean,
	changeState: (s: State) => void
}) => {
	const state: State = "in-progress";
	const [comment, setComment] = useState("");
	const canSubmit = statusChanged || comment !== "";
	const [_, setTasks] = useRecoilState(taskState);

	const [submitInProgress, setSubmitInProgress] = useState(false);

	const withAccessToken = useWithAccessToken();

	const serverId: string = (task as any).serverId;
	const [patients] = useRecoilState(patientState);
	const patient = patients[serverId]!;

	const submit = async () => {
		setSubmitInProgress(true);

		const commentNote = {
			authorReference: {
				reference: `Patient/${patient.id}`,
			},
			time: new Date().toISOString(),
			text: comment
		};

		const payload = {
			...task,
			note: [...task.note || [], commentNote],
			status: "in-progress",
			serverId: undefined,
		};

		await withAccessToken(serverId, async (token, patientId, fhirUri) => {
			const client = new Client( { baseUrl: fhirUri });
			client.bearerToken = token;

			const newTask = await client.update({
				resourceType: "Task",
				id: task.id as string,
				body: payload,
			}) as Task;

			setTasks(old => ({
				...old,
				[serverId]: old[serverId]?.map(t => t.id === newTask.id ? newTask : t) || []
			}));
		});
		
		setSubmitInProgress(false);
		setComment("");
	};

	return (
		<View>
			<VStack space={5}>
				<Card>
					<Text
						color="#464953"
						fontSize="lg"
						fontWeight="medium"
						mb={5}
					>
						Have you contacted the service provider organization?
					</Text>

					<FormControl mb={5}>
						<FormControl.Label>
							<Text
								fontSize="sm"
								color="#7b7f87"
							>
								Status:
							</Text>
						</FormControl.Label>
						<Select
							selectedValue={state}
							onValueChange={val => changeState(val as State)}
							accessibilityLabel="Select status"
							placeholder="Select status"
							placeholderTextColor="#828282"
						>
							{STATES.map(({ label, value }) => <Select.Item key={value} label={label} value={value} />)}
						</Select>
					</FormControl>

					<FormControl>
						<FormControl.Label>
							<Text
								fontSize="sm"
								color="#7b7f87"
							>
								Comment:
							</Text>
						</FormControl.Label>
						<TextArea
							textAlignVertical="top"
							value={comment}
							onChangeText={text => setComment(text)}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							placeholder="Enter your comment here..."
							totalLines={3}
						/>
					</FormControl>
				</Card>
				<Button
					flex={1}
					onPress={submit}
					colorScheme="blue"
					disabled={!canSubmit}
					isLoading={submitInProgress}
				>
					Submit
				</Button>
			</VStack>
		</View>
	);
};

const Yes = ({ changeState, task }: {
	task: Task,
	changeState: (s: State) => void
}) => {
	const state: State = "yes";
	const [outcome, setOutcome] = useState("");
	const canSubmit = outcome !== "";
	const [_, setTasks] = useRecoilState(taskState);

	const [submitInProgress, setSubmitInProgress] = useState(false);

	const withAccessToken = useWithAccessToken();

	const serverId: string = (task as any).serverId;

	const submit = async () => {
		setSubmitInProgress(true);

		const payload = {
			...task,
			status: "completed",
			statusReason: {
				text: outcome,
			},
			serverId: undefined,
		};

		await withAccessToken(serverId, async (token, patientId, fhirUri) => {
			const client = new Client( { baseUrl: fhirUri });
			client.bearerToken = token;

			const newTask = await client.update({
				resourceType: "Task",
				id: task.id as string,
				body: payload,
			}) as Task;

			setTasks(old => ({
				...old,
				[serverId]: old[serverId]?.map(t => t.id === newTask.id ? newTask : t) || []
			}));
		});
		
		setSubmitInProgress(false);
	};

	return (
		<View>
			<VStack space={5}>
				<Card>
					<Text
						color="#464953"
						fontSize="lg"
						fontWeight="medium"
						mb={5}
					>
						Have you contacted the service provider organization?
					</Text>

					<FormControl mb={5}>
						<FormControl.Label>
							<Text
								fontSize="sm"
								color="#7b7f87"
							>
								Status:
							</Text>
						</FormControl.Label>
						<Select
							selectedValue={state}
							onValueChange={val => changeState(val as State)}
							accessibilityLabel="Select status"
							placeholder="Select status"
							placeholderTextColor="#828282"
						>
							{STATES.map(({ label, value }) => <Select.Item key={value} label={label} value={value} />)}
						</Select>
					</FormControl>

					<FormControl>
						<FormControl.Label>
							<Text
								fontSize="sm"
								color="#7b7f87"
							>
								Outcome:
							</Text>
						</FormControl.Label>
						<TextArea
							textAlignVertical="top"
							value={outcome}
							onChangeText={text => setOutcome(text)}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							placeholder="Enter your outcome here..."
							totalLines={3}
						/>
					</FormControl>
				</Card>
				<Button
					flex={1}
					onPress={submit}
					colorScheme="blue"
					disabled={!canSubmit}
					isLoading={submitInProgress}
				>
					Submit
				</Button>
			</VStack>
		</View>
	);
};

const DoNotIntend = ({ changeState, task }: {
	task: Task,
	changeState: (s: State) => void
}) => {
	const state: State = "do-not-intend-to";
	const [outcome, setOutcome] = useState("");
	const canSubmit = outcome !== "";
	const [_, setTasks] = useRecoilState(taskState);

	const [submitInProgress, setSubmitInProgress] = useState(false);

	const withAccessToken = useWithAccessToken();

	const serverId: string = (task as any).serverId;

	const submit = async () => {
		setSubmitInProgress(true);

		const payload = {
			...task,
			status: "cancelled",
			statusReason: {
				text: outcome,
			},
			serverId: undefined,
		};

		await withAccessToken(serverId, async (token, patientId, fhirUri) => {
			const client = new Client( { baseUrl: fhirUri });
			client.bearerToken = token;

			const newTask = await client.update({
				resourceType: "Task",
				id: task.id as string,
				body: payload,
			}) as Task;

			setTasks(old => ({
				...old,
				[serverId]: old[serverId]?.map(t => t.id === newTask.id ? newTask : t) || []
			}));
		});
		
		setSubmitInProgress(false);
	};

	return (
		<View>
			<VStack space={5}>
				<Card>
					<Text
						color="#464953"
						fontSize="lg"
						fontWeight="medium"
						mb={5}
					>
						Have you contacted the service provider organization?
					</Text>

					<FormControl mb={5}>
						<FormControl.Label>
							<Text
								fontSize="sm"
								color="#7b7f87"
							>
								Status:
							</Text>
						</FormControl.Label>
						<Select
							selectedValue={state}
							onValueChange={val => changeState(val as State)}
							accessibilityLabel="Select status"
							placeholder="Select status"
							placeholderTextColor="#828282"
						>
							{STATES.map(({ label, value }) => <Select.Item key={value} label={label} value={value} />)}
						</Select>
					</FormControl>

					<FormControl>
						<FormControl.Label>
							<Text
								fontSize="sm"
								color="#7b7f87"
							>
								Reason:
							</Text>
						</FormControl.Label>
						<TextArea
							textAlignVertical="top"
							value={outcome}
							onChangeText={text => setOutcome(text)}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							placeholder="Enter your reason here..."
							totalLines={3}
						/>
					</FormControl>
				</Card>
				<Button
					flex={1}
					onPress={submit}
					colorScheme="blue"
					disabled={!canSubmit}
					isLoading={submitInProgress}
				>
					Submit
				</Button>
			</VStack>
		</View>
	);
};


const Cancelled = ({ task }: { task: Task }) => (
	<Card>
		<Text
			color="#464953"
			fontSize="lg"
			fontWeight="medium"
			mb={5}
		>
			Outcome
		</Text>

		<FormControl mb={5}>
			<FormControl.Label>
				<Text
					fontSize="sm"
					color="#7b7f87"
				>
					Have you contacted the service provider organization?
				</Text>
			</FormControl.Label>
			<Text
				fontSize="sm"
				color="#333"
			>
				Do not intend to
			</Text>
		</FormControl>

		<Divider mb={5} />

		<FormControl>
			<FormControl.Label>
				<Text
					fontSize="sm"
					color="#7b7f87"
				>
					Reason:
				</Text>
			</FormControl.Label>
			<Text
				fontSize="sm"
				color="#333"
			>
				{task.statusReason?.text || ""}
			</Text>
		</FormControl>
	</Card>
);

const Completed = ({ task }: { task: Task }) => (
	<Card>
		<Text
			color="#464953"
			fontSize="lg"
			fontWeight="medium"
			mb={5}
		>
			Outcome
		</Text>

		<FormControl mb={5}>
			<FormControl.Label>
				<Text
					fontSize="sm"
					color="#7b7f87"
				>
					Have you contacted the service provider organization?
				</Text>
			</FormControl.Label>
			<Text
				fontSize="sm"
				color="#333"
			>
				Yes
			</Text>
		</FormControl>

		<Divider mb={5} />

		<FormControl>
			<FormControl.Label>
				<Text
					fontSize="sm"
					color="#7b7f87"
				>
					Outcome:
				</Text>
			</FormControl.Label>
			<Text
				fontSize="sm"
				color="#333"
			>
				{task.statusReason?.text || ""}
			</Text>
		</FormControl>
	</Card>
);

export default MakeContactOutcome;
