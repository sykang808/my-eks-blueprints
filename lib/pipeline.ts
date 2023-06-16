// lib/pipeline.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';

export default class PipelineConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope,id)

    const account = props?.env?.account!;
    const region = props?.env?.region!;


    
    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns(
       new blueprints.VpcCniAddOn(),
        new blueprints.CoreDnsAddOn(),
        new blueprints.KubeProxyAddOn(),
        new blueprints.ArgoCDAddOn(),
        
        // Self-managed Add-ons
        new blueprints.addons.AwsForFluentBitAddOn(),
        new blueprints.addons.AwsLoadBalancerControllerAddOn(),
        new blueprints.addons.ClusterAutoScalerAddOn(),
        new blueprints.addons.EfsCsiDriverAddOn(),
        new blueprints.addons.MetricsServerAddOn()
    )
    .teams();

    
    blueprints.CodePipelineStack.builder()
      .name("eks-blueprints-workshop-pipeline")
      .owner("sykang808")
      .repository({
          repoUrl: 'my-eks-blueprints',
          credentialsSecretName: 'github-token',
          targetRevision: 'main'
      }).wave({
        id: "envs",
        stages: [   
          { id: "prod", stackBuilder: blueprint.clone('us-east-1')}
        ]
      })
      .build(scope, id+'-stack', { env:{ account:props?.env?.account, region:props?.env?.region}});
  }
}
