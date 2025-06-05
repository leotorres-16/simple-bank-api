import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { DefaultLambdaExecutionRole } from "../constructs/DefaultLambdaExecutionRole";
import { SimpleLambda } from "../constructs/SimpleLambda";

export interface Lambdas {
  userEndpoint: lambda.Function;
}

interface CreateLambdasProps {
  stage: string;
}

const USER_ENDPOINT_NAME = "user-endpoint";

export const createLambdas = (scope: Construct, props: CreateLambdasProps): Lambdas => {
  //Create the execution roles for the lambdas
  const defaultExecutionRole = new DefaultLambdaExecutionRole(scope, "default");

  //Create the lambdas
  const userEndpointLambdaFunction = new SimpleLambda(scope, USER_ENDPOINT_NAME, defaultExecutionRole, "UserEndpointLambdaLogs");

  //return the lambdas
  return {
    userEndpoint: userEndpointLambdaFunction.lambda,
  };
};
