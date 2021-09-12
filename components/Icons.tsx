import React from "react";
import Svg, { Circle, Color, Path, Rect } from "react-native-svg";
import Colors from "../utils/Colors";


type IconProps = { size?: number, color?: Color }


export const Success = ({ size=60, color=Colors.active }: IconProps) => (
	<Svg
		width={size}
		height={size}
		viewBox="0 0 60 60"
		fill="none"
	>
		<Path
			d="M51.429 28.04v1.972A21.43 21.43 0 1138.72 10.427m12.708 2.442L30 34.32l-6.429-6.428"
			stroke={color}
			strokeWidth={3}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Svg>
);


export const ClusterWithArrows = ({ size=60, color=Colors.active }: IconProps) => (
	<Svg
		width={size}
		height={size}
		viewBox="0 0 60 60"
		fill={color}
		stroke={color}
	>
		<Rect
			x={7.5}
			y={13.284}
			width={45}
			height={7.826}
			rx={3.913}
			strokeWidth={2}
			fill="none"
		/>
		<Rect
			x={7.5}
			y={26.325}
			width={45}
			height={7.826}
			rx={3.913}
			strokeWidth={2}
			fill="none"
		/>
		<Rect
			x={7.5}
			y={39.365}
			width={45}
			height={7.826}
			rx={3.913}
			strokeWidth={2}
			fill="none"
		/>
		<Circle cx={12.587} cy={17.197} stroke="none" r={1.174} />
		<Circle cx={12.587} cy={30.238} stroke="none" r={1.174} />
		<Circle cx={12.587} cy={43.278} stroke="none" r={1.174} />
		<Rect
			x={20.413}
			y={16.807}
			width={19.174}
			height={1.174}
			rx={0.587}
			stroke="none"
		/>
		<Rect
			x={20.413}
			y={29.847}
			width={19.174}
			height={1.174}
			rx={0.587}
			stroke="none"
		/>
		<Rect
			x={20.413}
			y={42.887}
			width={19.174}
			height={1.174}
			rx={0.587}
			stroke="none"
		/>
		<Path
			d="M40.16.793a1 1 0 00-1.413 0l-6.364 6.364a1 1 0 001.414 1.414l5.657-5.657 5.657 5.657a1 1 0 101.414-1.414L40.16.793zm.294 13.029V1.5h-2v12.322h2zM19.902 58.767a1 1 0 001.414 0l6.364-6.364a1 1 0 00-1.414-1.415l-5.657 5.657-5.657-5.657a1 1 0 00-1.414 1.415l6.364 6.364zm-.293-11.857v11.15h2V46.91h-2z"
			stroke="none"
		/>
	</Svg>
)

export const Error = ({size = 60, color = "#F56C6C"}: IconProps) => (
	<Svg
		width={size}
		height={size}
		fill="none"
	>
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M29.997 10.143c-10.966 0-19.855 8.89-19.855 19.855 0 10.966 8.89 19.856 19.855 19.856 10.966 0 19.856-8.89 19.856-19.856 0-10.966-8.89-19.855-19.856-19.855zM7.142 29.998c0-12.623 10.232-22.855 22.855-22.855 12.623 0 22.856 10.232 22.856 22.855 0 12.623-10.233 22.856-22.856 22.856-12.623 0-22.855-10.233-22.855-22.856zm21.445 4.53V18.997h3v15.531h-3zm0 2.59v2.589h3v-2.59h-3z"
			fill={color}
		/>
	</Svg>
)
