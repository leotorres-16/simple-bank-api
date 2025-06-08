import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { DefaultLambdaExecutionRole } from "../constructs/DefaultLambdaExecutionRole";
import { SimpleLambda } from "../constructs/SimpleLambda";

export interface Lambdas {
  userEndpoint: lambda.Function;
  accountEndpoint: lambda.Function;
  transactionEndpoint: lambda.Function;
}

interface CreateLambdasProps {
  stage: string;
}

const USER_ENDPOINT_NAME = "user-endpoint";
const ACCOUNT_ENDPOINT_NAME = "account-endpoint";
const TRANSACTION_ENDPOINT_NAME = "transaction-endpoint";

export const createLambdas = (scope: Construct, props: CreateLambdasProps): Lambdas => {
  //Create the execution roles for the lambdas
  const defaultExecutionRole = new DefaultLambdaExecutionRole(scope, "default");

  //Create the lambdas
  const userEndpointLambdaFunction = new SimpleLambda(scope, USER_ENDPOINT_NAME, defaultExecutionRole, "UserEndpointLambdaLogs");
  const accountEndpointLambdaFunction = new SimpleLambda(scope, ACCOUNT_ENDPOINT_NAME, defaultExecutionRole, "AccountEndpointLambdaLogs");
  const transactionEndpointLambdaFunction = new SimpleLambda(scope, TRANSACTION_ENDPOINT_NAME, defaultExecutionRole, "TransactionEndpointLambdaLogs");

  //return the lambdas
  return {
    userEndpoint: userEndpointLambdaFunction.lambda,
    accountEndpoint: accountEndpointLambdaFunction.lambda,
    transactionEndpoint: transactionEndpointLambdaFunction.lambda,
  };
};
