// bin/my-eks-blueprints.ts
import * as cdk from 'aws-cdk-lib';
import ClusterConstruct from '../lib/my-eks-blueprints-stack';
import PipelineConstruct from '../lib/pipeline'; // IMPORT OUR PIPELINE CONSTRUCT


const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region }
const props = { env }
new ClusterConstruct(app, 'cluster', props);
new PipelineConstruct(app, 'pipeline', props);
