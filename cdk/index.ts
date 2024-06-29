#!/usr/bin/env node

import { App, Stack, StackProps } from "aws-cdk-lib";
import { StaticSite } from "./static-site";

class MyStaticSiteStack extends Stack {
  constructor(parent: App, name: string, props?: StackProps) {
    super(parent, name, props);

    new StaticSite(this, "ShopCdkStaticSite");
  }
}

const app = new App();

new MyStaticSiteStack(app, "MyShopCdkStaticSite", {
  env: {
    region: process.env.AWS_REGION ?? "us-east-1",
  },
});

app.synth();
