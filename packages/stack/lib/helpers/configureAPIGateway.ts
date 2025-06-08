import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib";
import * as crypto from "crypto";
import { Construct } from "constructs";
import { Lambdas } from "./createLambdas";
import { IFunction } from "aws-cdk-lib/aws-lambda";

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
  const userEndpoints = configureUserEndpoints(version, props.lambdas.userEndpoint);

  const accountsEndpoint = version.addResource("accounts", {
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"],
      allowMethods: ["OPTIONS", "POST", "GET", "PATCH", "DELETE"],
    },
  });

  const withAccountId = accountsEndpoint.addResource("{accountId}");

  const accountEndpoints = configureAccountEndpoints(accountsEndpoint, withAccountId, props.lambdas.accountEndpoint);
  const transactionsEndpoint = configureTransactionsEndpoints(withAccountId, props.lambdas.transactionEndpoint);

  //deploy the new endpoints
  const d = new Date();
  const md5 = crypto.createHash("md5").update(d.toISOString()).digest("hex");
  const apigwDeploy = new apigw.Deployment(scope, `${props.stage}.banking${md5.slice(0, 8)}`, { api: bankingAPI, retainDeployments: true });
  apigwDeploy.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE);
  [userEndpoints, accountEndpoints, transactionsEndpoint].forEach((endpoint) => {
    endpoint.forEach((method) => {
      apigwDeploy._addMethodDependency(method);
    });
  });
  /* @ts-ignore */
  apigwDeploy.resource.stageName = props.stage;
};

const configureUserEndpoints = (root: apigw.Resource, lambda: IFunction): apigw.Method[] => {
  const usersEndpoint = root.addResource("users", {
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"],
      allowMethods: ["OPTIONS", "POST", "GET", "DELETE", "PATCH"],
    },
  });

  const createUserEndpoint = usersEndpoint.addMethod(
    "POST",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const withId = usersEndpoint.addResource("{userId}");

  const getUserEndpoint = withId.addMethod(
    "GET",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const deleteUserEndpoint = withId.addMethod(
    "DELETE",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const updateUserEndpoint = withId.addMethod(
    "PATCH",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  return [getUserEndpoint, createUserEndpoint, deleteUserEndpoint, updateUserEndpoint];
};

const configureAccountEndpoints = (root: apigw.Resource, withAccountId: apigw.Resource, lambda: IFunction): apigw.Method[] => {
  const createAccountEndpoint = root.addMethod(
    "POST",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const getAccountsEndpoint = root.addMethod(
    "GET",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const deleteAccountEndpoint = withAccountId.addMethod(
    "DELETE",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const updateAccountEndpoint = withAccountId.addMethod(
    "PATCH",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  return [getAccountsEndpoint, createAccountEndpoint, deleteAccountEndpoint, updateAccountEndpoint];
};

const configureTransactionsEndpoints = (root: apigw.Resource, lambda: IFunction): apigw.Method[] => {
  const TransactionsEndpoint = root.addResource("transactions", {
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"],
      allowMethods: ["OPTIONS", "POST", "GET"],
    },
  });

  const createTransactionEndpoint = TransactionsEndpoint.addMethod(
    "POST",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const listTransactionsEndpoint = TransactionsEndpoint.addMethod(
    "GET",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  const withTransactionId = TransactionsEndpoint.addResource("{transactionId}");

  const fetchTransactionEndpoint = withTransactionId.addMethod(
    "GET",
    new apigw.LambdaIntegration(lambda, {
      timeout: cdk.Duration.seconds(29),
    }),
    {
      apiKeyRequired: true,
    }
  );

  return [createTransactionEndpoint, listTransactionsEndpoint, fetchTransactionEndpoint];
};
