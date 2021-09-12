import React, { useEffect, useState } from "react";
import { Box, Text, View, HStack, Button } from "native-base";
import { Server } from "../../recoil/servers";
import moment from "moment";

const ServerViewToken = ({server}: { server: Server }): JSX.Element => {
	const { session } = server;
	const useUnixTime = (): number => {
		const [now, setNow] = useState(Date.now());
		useEffect(() => {
			const intervalId = setInterval(
				() => setNow(Date.now()),
				1000
			);
			return () => clearInterval(intervalId);
		}, []);
		return now;
	}

	const now = useUnixTime();
	const delta = session?.refresh?.expiresAt ? session?.refresh?.expiresAt - now : 0;
	const minutes = moment.duration(delta).minutes();
	const hours = moment.duration(delta).hours();
	const days = moment.duration(delta).days();
	const month = moment.duration(delta).months();

	//todo: should we show 0 0 0 0 when we don't have expiresAt. I believe it should be n/a
	return (
		<View>
			<Text color="#7B7F87" fontSize={14} mb={3} fontWeight={400}>Your access to the server will expire in:</Text>
			<HStack justifyContent="space-between" mb={3}>
				<Box justifyContent="center" alignItems="center">
					<Text fontSize={20} fontWeight="400">{ month ? month : 0 }</Text>
					<Text fontSize={10} fontWeight="400" color="#7B7F87">Month</Text>
				</Box>
				<Box justifyContent="center" alignItems="center">
					<Text fontSize={20} fontWeight="400">{ days ? days : 0 }</Text>
					<Text fontSize={10} fontWeight="400" color="#7B7F87">Days</Text>
				</Box>
				<Box justifyContent="center" alignItems="center">
					<Text fontSize={20} fontWeight="400">{ hours ? hours : 0 }</Text>
					<Text fontSize={10} fontWeight="400" color="#7B7F87">Hours</Text>
				</Box>
				<Box justifyContent="center" alignItems="center">
					<Text fontSize={20} fontWeight="400">{ minutes ? minutes : 0}</Text>
					<Text fontSize={10} fontWeight="400" color="#7B7F87">Minutes</Text>
				</Box>
				<Button bg="#0069FF">Renew</Button>
			</HStack>
		</View>
	)
}

export default ServerViewToken;
