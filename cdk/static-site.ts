#!/usr/bin/env node

import { Construct } from "constructs";
import { Stack } from "aws-cdk-lib"; // core constructs
import { aws_s3 as s3 } from "aws-cdk-lib"; // stable module
import { aws_s3_deployment as s3deploy } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";

export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "MyShopCdk-OAI"
    );

    const siteBucket = new s3.Bucket(this, "MyShopFrontendStaticBucket", {
      bucketName: "nodejs-aws-shop-react-egatsak-cdk",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "MyShopCdk-Distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudFrontOAI,
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

    new s3deploy.BucketDeployment(this, "MyShopCdk-Bucket-Deployment", {
      sources: [s3deploy.Source.asset("../dist/index.html")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
