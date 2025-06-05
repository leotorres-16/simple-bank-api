import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";

export class DefaultLambdaExecutionRole extends Construct {
  public role: iam.Role;

  constructor(scope: Construct, id: string) {
    super(scope, `default-lambda-execution-role-${id}`);
    this.role = new iam.Role(this, `default-lambda-execution-role-${id}`, {
      assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal("lambda.amazonaws.com")),
    });
    this.role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ["*"],
        actions: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      })
    );
  }
}
