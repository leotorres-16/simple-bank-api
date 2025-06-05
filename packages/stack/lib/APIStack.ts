import * as cdk from "aws-cdk-lib";

import { Construct } from "constructs";
import { createLambdas } from "./helpers/createLambdas";
import { configureAPIGateway } from "./helpers/configureAPIGateway";

export interface APIStackProps extends cdk.StackProps {
  readonly stage: string;
}

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);
    // New Lambda Functions

    const lambdas = createLambdas(this, {
      stage: props.stage,
    });

    configureAPIGateway(this, {
      stage: props.stage,
      lambdas: lambdas,
    });
  }
}
