# Simple Bank API

Small REST API that performs CRUD on basic bank operations

## How to work with this project

This Project uses volta to manage node version, and pnpm to manage dependencies. To install volta, run the following command:

```bash
# install Volta
curl https://get.volta.sh | bash

# install pnpm and node
volta install node
volta install pnpm
```

After installing volta, you should automatically change the node version, and you can run this command to install dependencies:

```bash
pnpm i
```

## Bundling Lambdas

In order to bundle the lambdas, you can run the following command:

```bash
pnpm run --filter '*' bundle
```

this will run any projects that have a bundle script in their package.json.

## Testing the Lambdas

In order to test the lambdas, you can run the following command:

```bash
pnpm run --filter '*' test
```

this will run any projects that have a test script in their package.json.

## Lambdas Structure

There are three lambdas in this project, each one representing a different endpoint of the api: user-endpoint, account-endpoint and transaction-endpoint. They all follow this structure

```
packages/
  my-new-lambda/
    src/
      handlers/
      helpers/
      mocks/
      store/
      index.ts
    package.json
    jest.config.js
    tsconfig.json
    tsconfig.prod.json
```

Please follow the existing lambads as templates (for example packages/user-endpoint). Each folder should contain: <br />

handlers: This is where the core of the API is, each handler deals with a different HTTP Request and this is where the core logic of the API is. <br />
helpers: Validations that can be reused across different handlers. <br />
mocks: This has test data, including mock API Gateway events, test objects and bodies the handlers would receive. <br />
store: This is the data layer of the API - Is not developed but this is where you would integrate with a Database or another API to persist the operations. <br />

The index at the root of src serves as routing for the lambda, it will determine which of the handlers should be executed and would deal with the authentication (not implemented but mocked)

## Shared Structure

Shared has common logic for all three lambdas, more specifically it has all the models used for the API to ensure all three lambdas have a common language and handlers that can be used in all three of them the same way.

```
packages/
  shared/
    src/
      handlers/
      models/
      index.ts
    package.json
    jest.config.js
    tsconfig.json
    tsconfig.prod.json
    cdk.json
```

handlers: same as in the lambdas, only contains authentication which would operate the same in all three of them. <br />
Models: Different data types that are common across the API like Account, Transaction and User. <br />

## Stack Structure

This is the CDK project that should contain the infrastructure as code for the API, it creates the lambdas and configures API Gateway.

```
packages/
  stack/
    bin/
    lib/
      constructs/
      helpers/
      APIStack.ts
    package.json
    jest.config.js
    tsconfig.json
```

construct: rehusable CDK constructs like simple lambda functions and execution roles. <br />
helpers: Code for configuring the lambdas and API Gateway so they can be looked at separate. <br />
APIStack.ts: Where the stack is build and all pieces come together. <br />
