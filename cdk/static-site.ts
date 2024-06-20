#!/usr/bin/env node

import { Construct } from "constructs";
import { Stack } from "aws-cdk-lib"; // core constructs
import { aws_s3 as s3 } from "aws-cdk-lib"; // stable module
import { aws_s3_deployment as s3deploy } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";

export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const originAccessControl = new cloudfront.CfnOriginAccessControl(
      this,
      "MyOriginAccessControl",
      {
        originAccessControlConfig: {
          name: "nodejs-aws-shop-react-egatsak-origin-access-control",
          originAccessControlOriginType: "s3",
          signingProtocol: "sigv4",
          signingBehavior: "always",
        },
      }
    );

    const siteBucket = new s3.Bucket(this, "MyShopFrontendStaticBucket", {
      bucketName: "nodejs-aws-shop-react-egatsak-cdk",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "MyCloudFrontDistribution",
      {
        defaultRootObject: "index.html",
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    const cfnDistribution = distribution.node
      .defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride(
      "DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity",
      ""
    );
    cfnDistribution.addPropertyOverride(
      "DistributionConfig.Origins.0.OriginAccessControlId",
      originAccessControl.getAtt("Id")
    );

    // using Cache Policy instead of obsolete Cache Behavior
    cfnDistribution.addPropertyDeletionOverride(
      "DistributionConfig.DefaultCacheBehavior.AllowedMethods"
    );
    cfnDistribution.addPropertyDeletionOverride(
      "DistributionConfig.DefaultCacheBehavior.CachedMethods"
    );
    cfnDistribution.addPropertyDeletionOverride(
      "DistributionConfig.DefaultCacheBehavior.ForwardedValues"
    );
    cfnDistribution.addPropertyOverride(
      "DistributionConfig.DefaultCacheBehavior.CachePolicyId",
      cloudfront.CachePolicy.CACHING_OPTIMIZED.cachePolicyId
    );

    const distributionArn = `arn:aws:cloudfront::${distribution.stack.account}:distribution/${distribution.distributionId}`;

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": distributionArn,
          },
        },
      })
    );

    new s3deploy.BucketDeployment(this, "MyShopCdk-Bucket-Deployment", {
      sources: [s3deploy.Source.asset("dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    distribution.applyRemovalPolicy(RemovalPolicy.DESTROY);
    originAccessControl.applyRemovalPolicy(RemovalPolicy.DESTROY);

    new CfnOutput(this, "S3BucketUrl", {
      value: siteBucket.bucketWebsiteUrl,
    });

    new CfnOutput(this, "CloudFrontUrl", {
      value: distribution.distributionDomainName,
    });
  }
}
