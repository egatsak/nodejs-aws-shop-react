import { App, Stack } from "aws-cdk-lib";
import { StaticSite } from "./static-site";

class MyStaticSiteStack extends Stack {
  constructor(parent: App, name: string) {
    super(parent, name);

    new StaticSite(this, "ShopCdkStaticSite");
  }
}

const app = new App();

new MyStaticSiteStack(app, "MyShopCdkStaticSite");

app.synth();
