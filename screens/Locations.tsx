import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { RootStackParamList } from "../App";
import healthcareServiceState from "../recoil/task/healthcareService";
import { ScrollView, VStack, Text, Link } from "native-base";
import ResourceCard from "../components/ResourceCard";
import ResourceCardItem, { ResourceCardItemCustom } from "../components/ResourceCardItem";
import locationsState from "../recoil/task/locations";
import { Address, CodeableConcept, Coding, ContactPoint } from "fhir/r4";
import { filterMap } from "../utils";

const showCodeableConcepts = (ccs?: CodeableConcept[]) =>
	filterMap(ccs || [], cc => cc.text || cc.coding?.map(coding => coding.display || coding.code).find(Boolean) || false);

const ensureHttp = (url: string) => /^http(s)?:\/\//.test(url) ? url : `https://${url}`;
const phones = (tele?: ContactPoint[]) => tele?.filter(t => t.system === "phone").flatMap(t => t.value ? [t.value] : []) || [];
const websites = (tele?: ContactPoint[]) => tele?.filter(t => t.system === "url").flatMap(t => t.value ? [ensureHttp(t.value)] : []) || [];
const address = (a?: Address) => a?.text || [a?.line?.filter(Boolean)?.join(", "), a?.city, a?.district, a?.state, a?.postalCode, a?.country].filter(Boolean).join(", ");


const Locations = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, "Locations">) => {
	const { serverId, healthcareServiceId } = route.params;
	const service = useRecoilValue(healthcareServiceState)[serverId]?.find(x => x.id === healthcareServiceId);
	const pageTitle = service?.name || "";

	const locations = useRecoilValue(locationsState)[serverId] || [];
	const data = locations.map(location => ({
		id: location.id,
		name: location.name || "Unknown",
		status: location.status || "unknown",
		type: showCodeableConcepts(location.type),
		phones: phones(location.telecom),
		websites: websites(location.telecom),
		address: address(location.address),
	}));

	useEffect(() => {
		navigation.setOptions({ title: pageTitle });
	}, ["pageTitle"]);

	return (
		<ScrollView>
			<VStack p={5} space={5}>
				{ data.map(location => (
					<ResourceCard
						key={location.id}
						title={location.name}
						badge={location.status}
					>
						<ResourceCardItem label="Type">
							{location.type}
						</ResourceCardItem>
						<ResourceCardItem label="Location">
							{location.address}
						</ResourceCardItem>
						<ResourceCardItemCustom label="Phone">
							<VStack flex={1}>
								{location.phones.map(phone => (
									<Link
										href={`tel:${phone}`}
										isExternal
									>
										<Text
											fontSize="sm"
											underline={true}
											color="blue.600"
										>
											{ phone }
										</Text>
									</Link>
								))}
							</VStack>
						</ResourceCardItemCustom>
						<ResourceCardItemCustom label="Website">
							<VStack flex={1}>
								{location.websites.map(website => (
									<Link
										href={website}
										isExternal
									>
										<Text
											fontSize="sm"
											underline={true}
											color="blue.600"
										>
											{ website }
										</Text>
									</Link>
								))}
							</VStack>
						</ResourceCardItemCustom>
					</ResourceCard>
				))}
			</VStack>
		</ScrollView>
	)
};

export default Locations;
