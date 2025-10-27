"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Podsqueeze = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Podsqueeze {
    constructor() {
        this.description = {
            displayName: 'Podsqueeze',
            name: 'podsqueeze',
            icon: 'file:podsqueeze.png',
            group: ['transform'],
            version: 1,
            description: 'Process and retrieve podcast episode assets via Podsqueeze API',
            defaults: {
                name: 'Podsqueeze',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'podsqueezeApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Start Job & Wait for Assets',
                            value: 'startJob',
                            description: 'Upload or reference an episode and wait until assets are ready',
                        },
                    ],
                    default: 'startJob',
                },
                {
                    displayName: 'Podcast ID',
                    name: 'podcastId',
                    type: 'string',
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Language',
                    name: 'language',
                    type: 'string',
                    default: 'en',
                },
                {
                    displayName: 'Episode URL',
                    name: 'episodeUrl',
                    type: 'string',
                    default: '',
                    description: 'Publicly accessible URL to the audio/video file',
                },
                {
                    displayName: 'File (Base64)',
                    name: 'file',
                    type: 'string',
                    default: '',
                    description: 'Alternative to URL: base64-encoded media file',
                },
                {
                    displayName: 'Episode Title',
                    name: 'episodeTitle',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Podcast Title',
                    name: 'podcastTitle',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Polling Interval (seconds)',
                    name: 'pollInterval',
                    type: 'number',
                    default: 15,
                    description: 'How often to check job status',
                },
                {
                    displayName: 'Timeout (seconds)',
                    name: 'timeout',
                    type: 'number',
                    default: 300,
                    description: 'Maximum wait time before aborting (default 5 min)',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('podsqueezeApi');
        const token = credentials.apiToken;
        for (let i = 0; i < items.length; i++) {
            const podcastId = this.getNodeParameter('podcastId', i);
            const language = this.getNodeParameter('language', i);
            const episodeUrl = this.getNodeParameter('episodeUrl', i);
            const file = this.getNodeParameter('file', i);
            const podcastTitle = this.getNodeParameter('podcastTitle', i);
            const episodeTitle = this.getNodeParameter('episodeTitle', i);
            const pollInterval = this.getNodeParameter('pollInterval', i);
            const timeout = this.getNodeParameter('timeout', i);
            // 1. Start Job
            const startPayload = {
                mode: 'process_episode',
                podcastId,
                language,
            };
            if (episodeUrl)
                startPayload.episodeUrl = episodeUrl;
            if (file)
                startPayload.file = file;
            if (podcastTitle)
                startPayload.podcastTitle = podcastTitle;
            if (episodeTitle)
                startPayload.episodeTitle = episodeTitle;
            let startResponse;
            try {
                startResponse = await this.helpers.httpRequest({
                    method: 'POST',
                    url: 'https://europe-central2-wannabe-entrepreneur.cloudfunctions.net/podsqueeze-api',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: startPayload,
                    json: true,
                });
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Podsqueeze start job failed: ${error.message}`);
            }
            const episodeId = startResponse.episodeId;
            if (!episodeId) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No episodeId returned from Podsqueeze');
            }
            // 2. Poll job status until completed
            const startTime = Date.now();
            let jobStatus = 'transcribing';
            let jobResponse;
            while (jobStatus !== 'completed') {
                await new Promise((resolve) => setTimeout(resolve, pollInterval * 1000));
                try {
                    jobResponse = await this.helpers.httpRequest({
                        method: 'POST',
                        url: 'https://europe-central2-wannabe-entrepreneur.cloudfunctions.net/podsqueeze-api',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: {
                            mode: 'get_job_status',
                            podcastId,
                            episodeId,
                        },
                        json: true,
                    });
                    jobStatus = jobResponse.status;
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Podsqueeze job status check failed: ${error.message}`);
                }
                if (Date.now() - startTime > timeout * 1000) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Timeout waiting for Podsqueeze job completion');
                }
            }
            // 3. Fetch assets
            let assetsResponse;
            try {
                assetsResponse = await this.helpers.httpRequest({
                    method: 'POST',
                    url: 'https://europe-central2-wannabe-entrepreneur.cloudfunctions.net/podsqueeze-api',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: {
                        mode: 'get_episode_assets',
                        podcastId,
                        episodeId,
                    },
                    json: true,
                });
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Podsqueeze get assets failed: ${error.message}`);
            }
            returnData.push({ json: assetsResponse });
        }
        return [returnData];
    }
}
exports.Podsqueeze = Podsqueeze;
