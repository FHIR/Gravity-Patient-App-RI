import { Task } from "fhir/r4";

export const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//todo: double check this logic if it's correct
export const filterNewTasks = (tasks: Task[]): Task[] => tasks.filter(t => t.status === "draft" || t.status === "requested" || t.status === "received" || t.status === "accepted" || t.status === "ready");
export const filterInProgressTasks = (tasks: Task[]): Task[] => tasks.filter(t => t.status === "in-progress");
export const filterSubmittedTasks = (tasks: Task[]): Task[] => tasks.filter(t => t.status === "rejected" || t.status === "cancelled" || t.status === "on-hold" || t.status === "failed" || t.status === "completed" || t.status === "entered-in-error");

export const checkValue = (value: string | undefined): string => value || "N/A";
