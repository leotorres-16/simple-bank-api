#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { APIStack } from "../lib/APIStack";

const app = new cdk.App();

new APIStack(app, "BankingAPIProdStack", {
  stage: "live",
});
