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
    var invokeUrl = 'https://kd32ih1imd.execute-api.us-east-1.amazonaws.com/test';
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
    
    
    apigClient.authenticatedGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var authenticatedGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/authenticated').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(authenticatedGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.authenticatedOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var authenticatedOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/authenticated').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(authenticatedOptionsRequest, authType, additionalParams, config.apiKey);
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
    
    
    apigClient.goalsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var goalsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/goals').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsPostRequest, authType, additionalParams, config.apiKey);
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
    
    
    apigClient.goalsGuidGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidInvitesGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidInvitesGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/invites').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidInvitesGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidInvitesPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidInvitesPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/invites').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidInvitesPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidInvitesOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidInvitesOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/invites').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidInvitesOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidInvitesUuidGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid', 'guid'], ['body']);
        
        var goalsGuidInvitesUuidGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/invites/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid', 'guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidInvitesUuidGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidInvitesUuidPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid', 'guid'], ['body']);
        
        var goalsGuidInvitesUuidPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/invites/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid', 'guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidInvitesUuidPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidInvitesUuidDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid', 'guid'], ['body']);
        
        var goalsGuidInvitesUuidDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/invites/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid', 'guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidInvitesUuidDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidInvitesUuidOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid', 'guid'], ['body']);
        
        var goalsGuidInvitesUuidOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/invites/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid', 'guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidInvitesUuidOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidTasksGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidTasksGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/tasks').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidTasksGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidTasksPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidTasksPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/tasks').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidTasksPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidTasksOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['guid'], ['body']);
        
        var goalsGuidTasksOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/tasks').expand(apiGateway.core.utils.parseParametersToObject(params, ['guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidTasksOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidTasksUuidPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid', 'guid'], ['body']);
        
        var goalsGuidTasksUuidPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/tasks/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid', 'guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidTasksUuidPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidTasksUuidDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid', 'guid'], ['body']);
        
        var goalsGuidTasksUuidDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/tasks/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid', 'guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidTasksUuidDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.goalsGuidTasksUuidOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid', 'guid'], ['body']);
        
        var goalsGuidTasksUuidOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/goals/{guid}/tasks/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid', 'guid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(goalsGuidTasksUuidOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.teamsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['user'], ['body']);
        
        var teamsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/teams').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['user']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(teamsGetRequest, authType, additionalParams, config.apiKey);
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
    
    
    apigClient.teamsMembershipGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['team'], ['body']);
        
        var teamsMembershipGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/teams/membership').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['team']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(teamsMembershipGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.teamsMembershipPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var teamsMembershipPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/teams/membership').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(teamsMembershipPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.teamsMembershipOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var teamsMembershipOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/teams/membership').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(teamsMembershipOptionsRequest, authType, additionalParams, config.apiKey);
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
    
    
    apigClient.teamsUuidPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid'], ['body']);
        
        var teamsUuidPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/teams/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(teamsUuidPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.teamsUuidDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['uuid'], ['body']);
        
        var teamsUuidDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/teams/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, ['uuid'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(teamsUuidDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.teamsUuidOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var teamsUuidOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/teams/{uuid}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(teamsUuidOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var usersPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/users').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/users').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersAuthenticatePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersAuthenticatePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/users/authenticate').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersAuthenticatePostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersAuthenticateOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersAuthenticateOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/users/authenticate').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersAuthenticateOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersPasswordPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersPasswordPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/users/password').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersPasswordPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersPasswordOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersPasswordOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/users/password').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersPasswordOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersValidatePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersValidatePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/users/validate').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersValidatePostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersValidateOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersValidateOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/users/validate').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersValidateOptionsRequest, authType, additionalParams, config.apiKey);
    };
    

    return apigClient;
};
