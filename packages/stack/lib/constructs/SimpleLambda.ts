import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";
import { DefaultLambdaExecutionRole } from "./DefaultLambdaExecutionRole";
import { Duration } from "aws-cdk-lib";
import { DataIdentifier, DataProtectionPolicy, LogGroup } from "aws-cdk-lib/aws-logs";

export class SimpleLambda extends Construct {
  public lambda: lambda.Function;

  constructor(scope: Construct, id: string, executionRole: DefaultLambdaExecutionRole, logGroupName: string, timeout: number = 30) {
    super(scope, id);

    this.lambda = new lambda.Function(this, `${id}-lambda`, {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.resolve(__dirname, `../../../${id}/packaged-lambda`)),
      handler: `${id}/src/index.handler`,
      timeout: Duration.seconds(timeout),
      role: executionRole.role,
      logGroup: new LogGroup(this, logGroupName, {
        dataProtectionPolicy: new DataProtectionPolicy({
          identifiers: [DataIdentifier.CREDITCARDNUMBER, DataIdentifier.EMAILADDRESS, DataIdentifier.CREDITCARDSECURITYCODE],
        }),
      }),
    });
  }
}
