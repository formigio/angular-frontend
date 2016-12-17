/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }


    // extract endpoint and path from url
    var invokeUrl = 'https://d4el2racxe.execute-api.us-east-1.amazonaws.com/mock';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);



    apigClient.rootOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var rootOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(rootOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.authGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['Content-Type', 'x-amz-security-token', 'Authorization', 'x-amz-date'], ['body']);

        var authGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/auth').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['Content-Type', 'x-amz-security-token', 'Authorization', 'x-amz-date']),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };

        var signingRequest = authGetRequest;

        signingRequest.path = pathComponent + uritemplate('/auth/secure').expand(apiGateway.core.utils.parseParametersToObject(params, []));

        signedAuth = apiGatewayClient.signRequest(signingRequest, authType, additionalParams, config.apiKey);

        console.log(signedAuth.headers);
        console.log(authGetRequest.headers);
        authGetRequest.path = pathComponent + uritemplate('/auth').expand(apiGateway.core.utils.parseParametersToObject(params, []));
        authGetRequest.headers['x-forward-Authorization'] = signedAuth.headers.Authorization;
        authGetRequest.headers['x-forward-amz-date'] = signedAuth.headers['x-amz-date'];

        return apiGatewayClient.makeRequest(authGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.authOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var authOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/auth').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(authOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.authSecureGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var authSecureGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/auth/secure').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(authSecureGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.authSecureOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var authSecureOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/auth/secure').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(authSecureOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.goalsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['team'], ['body']);

        var goalsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/goals').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['team']),
            body: body
        };


        return apiGatewayClient.makeRequest(goalsGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.goalsPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var goalsPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/goals').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(goalsPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.goalsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var goalsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/goals').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(goalsPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.goalsDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['goal'], ['body']);

        var goalsDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/goals').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['goal']),
            body: body
        };


        return apiGatewayClient.makeRequest(goalsDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.goalsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var goalsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/goals').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(goalsOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.goalsUuidGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['uuid'], ['body']);

        var goalsUuidGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(goalsUuidGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.goalsUuidOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var goalsUuidOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(goalsUuidOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.invitesGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['goal'], ['body']);

        var invitesGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/invites').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['goal']),
            body: body
        };


        return apiGatewayClient.makeRequest(invitesGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.invitesPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var invitesPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/invites').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(invitesPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.invitesDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['invite'], ['body']);

        var invitesDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/invites').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['invite']),
            body: body
        };


        return apiGatewayClient.makeRequest(invitesDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.invitesOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var invitesOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/invites').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(invitesOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.tasksGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['goal'], ['body']);

        var tasksGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/tasks').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['goal']),
            body: body
        };


        return apiGatewayClient.makeRequest(tasksGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.tasksPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var tasksPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/tasks').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(tasksPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.tasksDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['task'], ['body']);

        var tasksDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/tasks').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['task']),
            body: body
        };


        return apiGatewayClient.makeRequest(tasksDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.tasksOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var tasksOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/tasks').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(tasksOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.teamMembersGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var teamMembersGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/team-members').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(teamMembersGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.teamMembersOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var teamMembersOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/team-members').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(teamMembersOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.teamsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var teamsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/teams').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(teamsGetRequest, authType, additionalParams, config.apiKey);
    };

    apigClient.teamsUuidGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['uuid'], ['body']);

        var teamsUuidGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/teams/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(teamsUuidGetRequest, authType, additionalParams, config.apiKey);
    };

    apigClient.teamsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var teamsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/teams').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(teamsPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.teamsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var teamsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/teams').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(teamsOptionsRequest, authType, additionalParams, config.apiKey);
    };


    return apigClient;
};
