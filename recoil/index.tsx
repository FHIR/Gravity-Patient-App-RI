import React, { ReactNode, useEffect, useState } from "react";
import { RecoilRoot, Snapshot, MutableSnapshot, useRecoilTransactionObserver_UNSTABLE, RecoilState } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

import { serversState } from "./servers";
import role from "./roleState";


const persistedAtoms: RecoilState<any>[] = [
	serversState,
	role
]


const persistState = async (snapshot: Snapshot) => {
	const state = await Promise.all(
		persistedAtoms.map(atom => snapshot.getPromise(atom).then(res => [atom.key, res] as [string, typeof res]))
	);
	const items = state.map(([key, value]) => [key, JSON.stringify(value)] as [string, string]);
	return AsyncStorage.multiSet(items);
}


const restoreState = async () => {
	const items = await AsyncStorage.multiGet(persistedAtoms.map(atom => atom.key));

	return (snapshot: MutableSnapshot) => {
		items.forEach(([key, json]) => {
			if (json === null) {
				return;
			}
			const atom = persistedAtoms.find(atom => atom.key === key);
			if (!atom) {
				return;
			}
			const value = JSON.parse(json);
			snapshot.set(atom, value);
		})
	}
}


const PersistContainer = ({ children }: { children: ReactNode }) => {
	useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => persistState(snapshot));
	
	return <>{children}</>
}


export const RecoilRootWithPersisance = ({ children }: { children: ReactNode }) => {
	type RecoilStateInitializer = (s: MutableSnapshot) => void

	const [init, setInit] = useState<RecoilStateInitializer | null>(null);

	useEffect(() => {
		restoreState().then(init => setInit(() => init));
	}, []);

	return init === null ? (
		<ActivityIndicator />
	) : (
		<RecoilRoot initializeState={init}>
			<PersistContainer>
				{children}
			</PersistContainer>
		</RecoilRoot>
	);
}
