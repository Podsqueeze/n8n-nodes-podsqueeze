"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodsqueezeApi = void 0;
class PodsqueezeApi {
    constructor() {
        this.name = 'podsqueezeApi';
        this.displayName = 'Podsqueeze API';
        this.documentationUrl = 'https://podsqueeze.com';
        this.properties = [
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
}
exports.PodsqueezeApi = PodsqueezeApi;
