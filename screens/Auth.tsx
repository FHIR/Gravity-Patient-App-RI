import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { AuthRequestConfig, DiscoveryDocument, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useRecoilState } from "recoil";
import { Server, serversState } from "../recoil/servers";
import { makeURLEncodedBody } from "../utils/auth";


const useProxy = true;
const redirectUri = makeRedirectUri({ useProxy });

const scopes = ["openid", "fhirUser", "launch/patient", "patient/*.*"];
// const scopes = ["openid", "fhirUser", "patient/*.*"];


const Auth = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, "Auth">) => {
    const [servers, setServers] = useRecoilState(serversState);
    const theServer = servers[route.params.serverId];
    const done = (newState: Server) => {
        setServers(oldValue => ({
            ...oldValue,
            [route.params.serverId]: newState
        }));
        navigation.goBack();
    };

    return theServer ? ServerAuth(theServer, done) : <></>;
};


const ServerAuth = (server: Server, onDone: (s: Server) => unknown) => {
    const config: AuthRequestConfig = {
        clientId: server.authConfig.clientId,
        redirectUri,
        scopes,
        extraParams: {
            aud: server.fhirUri
        }
    };
    const discovery: DiscoveryDocument = {
        authorizationEndpoint: server.authConfig.authUri,
        tokenEndpoint: server.authConfig.tokenUri
    };

    const [request, response, promptAsync] = useAuthRequest(config, discovery);

    const code = response?.type === "success" ? response?.params.code : undefined;
    useEffect(() => {
        if (!code) {
            return;
        }
        fetch(server.authConfig.tokenUri, {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            body: makeURLEncodedBody({
                grant_type: "authorization_code",
                client_id: server.authConfig.clientId,
                redirect_uri: redirectUri,
                code: code,
                code_verifier: request?.codeVerifier
            })
        })
        .then(resp => resp.json())
        .then(resp => {
            const newServerState = {
                ...server,
                session: {
                    patientId: resp.patient,
                    token: {
                        access: resp.access_token
                    }
                }
            };
            onDone(newServerState);
        });
    }, [code]);

    return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>
                Login to <Text style={{ fontSize: 18, fontWeight: "500" }}>{server.title}</Text>
            </Text>
            <Text></Text>
            <Button
                title="Lets gooo!!"
                onPress={() => promptAsync({ useProxy })}
            />
        </View>
    );
};


export default Auth;
