import React from "react";
import Card from "../Card";
import { HStack, Icon, Text, VStack } from "native-base";
import { Path } from "react-native-svg";
import { useRecoilValue } from "recoil";
import { coverageInsuranceState } from "../../recoil/coverage";
import { checkValue } from "../../utils";


const InsurancesCard = ():JSX.Element => {
	const [primaryInsurance] = useRecoilValue(coverageInsuranceState);

	return (
		<Card flex={1}>
			<HStack
				space={1}
				alignItems="center"
				mb={4}
			>
				<Icon
					size={5}
					viewBox="0 0 20 20"
					fill="none"
				>
					<Path
						d="M5.4785 4.162L10.5 3L15.5215 4.162C15.6572 4.19341 15.7786 4.27207 15.8656 4.38498C15.9526 4.4979 16 4.63833 16 4.78309V11.1385C16 11.767 15.8509 12.3858 15.566 12.94C15.2812 13.4942 14.8694 13.9665 14.3671 14.3152L10.5 17L6.63289 14.3152C6.13072 13.9666 5.71895 13.4943 5.4341 12.9403C5.14926 12.3862 5.00014 11.7675 5 11.1391V4.78309C5.00002 4.63833 5.04745 4.4979 5.13444 4.38498C5.22143 4.27207 5.34279 4.19341 5.4785 4.162ZM6.22222 5.29345V11.1385C6.22223 11.5575 6.32157 11.97 6.51144 12.3395C6.7013 12.7089 6.97581 13.0238 7.31061 13.2563L10.5 15.4708L13.6894 13.2563C14.0241 13.0239 14.2986 12.7091 14.4884 12.3397C14.6783 11.9704 14.7777 11.558 14.7778 11.1391V5.29345L10.5 4.30455L6.22222 5.29345ZM10.5 9.36364C10.0948 9.36364 9.70621 9.19602 9.4197 8.89767C9.13318 8.59932 8.97222 8.19466 8.97222 7.77273C8.97222 7.35079 9.13318 6.94614 9.4197 6.64778C9.70621 6.34943 10.0948 6.18182 10.5 6.18182C10.9052 6.18182 11.2938 6.34943 11.5803 6.64778C11.8668 6.94614 12.0278 7.35079 12.0278 7.77273C12.0278 8.19466 11.8668 8.59932 11.5803 8.89767C11.2938 9.19602 10.9052 9.36364 10.5 9.36364ZM7.7665 12.5455C7.84058 11.8444 8.16047 11.1965 8.66488 10.7259C9.16929 10.2553 9.82274 9.99504 10.5 9.99504C11.1773 9.99504 11.8307 10.2553 12.3351 10.7259C12.8395 11.1965 13.1594 11.8444 13.2335 12.5455H7.7665Z"
						fill="#BECDFF"
					/>
				</Icon>
				<Text
					fontSize="xs"
					fontWeight="medium"
					ml={1}
				>
					Insurances
				</Text>
			</HStack>
			<VStack>
				{ primaryInsurance ?
					<>
						<Text
							fontSize="xxs"
							color="#7B7F87"
						>
							Primary
						</Text>
						<Text fontSize="md">{ primaryInsurance.name }</Text>
					</>
					:
					<Text fontSize="md">{ checkValue(undefined) }</Text>
				}
			</VStack>
		</Card>
	);
};

export default InsurancesCard;
