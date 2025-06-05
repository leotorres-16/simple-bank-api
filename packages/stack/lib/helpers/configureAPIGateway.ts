import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib";
import * as crypto from "crypto";
import { Construct } from "constructs";
import { Lambdas } from "./createLambdas";

interface ConfigureApiGatewayProps {
  stage: string;
  lambdas: Lambdas;
}

export const configureAPIGateway = (scope: Construct, props: ConfigureApiGatewayProps): void => {
  // Import the Existing API Gateway Stack
  const bankingAPI = new apigw.RestApi(scope, "bankingAPIG");

  //create root endpoint (v1)
  const version = bankingAPI.root.addResource("v1", {
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"],
      allowMethods: ["OPTIONS", "POST", "GET"],
    },
  });

  //create user endpoint (users)
  const usersEndpoint = version.addResource("users", {
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"],
      allowMethods: ["OPTIONS", "POST", "GET"],
    },
  });

  const getUserEndpoint = usersEndpoint.addMethod(
    "GET",
    new apigw.LambdaIntegration(props.lambdas.userEndpoint, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const userEndpoints = [getUserEndpoint];

  //deploy the new endpoints
  const d = new Date();
  const md5 = crypto.createHash("md5").update(d.toISOString()).digest("hex");
  const apigwDeploy = new apigw.Deployment(scope, `${props.stage}.banking${md5.slice(0, 8)}`, { api: bankingAPI, retainDeployments: true });
  apigwDeploy.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE);
  [userEndpoints].forEach((endpoint) => {
    endpoint.forEach((method) => {
      apigwDeploy._addMethodDependency(method);
    });
  });
  /* @ts-ignore */
  apigwDeploy.resource.stageName = props.stage;
};
