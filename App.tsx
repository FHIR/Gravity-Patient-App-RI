import React from "react";
import { RecoilRoot } from "recoil";
import { LogBox } from "react-native";
import { NativeBaseProvider } from "native-base";
import Navigation from "./screens/Navigation";

// todo: temporary recoil fix, should be fixed in expo sdk that support react-native 0.64+, probably sdk 43
// https://github.com/facebookexperimental/Recoil/issues/1030
// https://github.com/facebookexperimental/Recoil/issues/951
LogBox && LogBox.ignoreLogs(["Setting a timer", "Can't perform a React state update on an unmounted component"]);

const App = (): JSX.Element =>
	(<RecoilRoot>
		<NativeBaseProvider>
			<Navigation></Navigation>
		</NativeBaseProvider>
	</RecoilRoot>);

export default App;
