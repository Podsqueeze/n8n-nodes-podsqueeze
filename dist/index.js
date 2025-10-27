"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = exports.nodes = void 0;
const Podsqueeze_node_1 = require("./nodes/Podsqueeze/Podsqueeze.node");
const PodsqueezeApi_credentials_1 = require("./credentials/PodsqueezeApi.credentials");
exports.nodes = [Podsqueeze_node_1.Podsqueeze];
exports.credentials = [PodsqueezeApi_credentials_1.PodsqueezeApi];
