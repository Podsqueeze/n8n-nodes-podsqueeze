import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PodsqueezeApi implements ICredentialType {
	name = 'podsqueezeApi';
	displayName = 'Podsqueeze API';
	documentationUrl = 'https://podsqueeze.com';
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

