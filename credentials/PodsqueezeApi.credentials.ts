import { ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class PodsqueezeApi implements ICredentialType {
	name = 'podsqueezeApi';
	displayName = 'Podsqueeze API';
	documentationUrl = 'https://podsqueeze.com';
	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: 'https://europe-central2-wannabe-entrepreneur.cloudfunctions.net/podsqueeze-api',
			headers: {
				Authorization: 'Bearer {{$credentials.apiToken}}',
				'Content-Type': 'application/json',
			},
		},
	};
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Podsqueeze API token from your dashboard (API Access section)',
		},
	];
}

