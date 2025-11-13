import { ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';
export declare class PodsqueezeApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    test: ICredentialTestRequest;
    properties: INodeProperties[];
}
