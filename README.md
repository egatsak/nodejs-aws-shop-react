# React-shop-cloudfront

This is frontend starter project for nodejs-aws mentoring program.
Deployed into AWS cloud using [AWS CDK](https://aws.amazon.com/cdk/).

## Deploy

[S3 Bucket - shows 403](http://nodejs-aws-shop-react-egatsak-cdk.s3-website-us-east-1.amazonaws.com/index.html) - resources stored at S3 bucket are blocked from public access

[Cloudfront CDN](https://dosfklikrk6wd.cloudfront.net/) - deployed app available online. 

[Backend repository](https://github.com/egatsak/nodejs-aws-shop-backend)

## Authorization

Custom lambda authorizer has been attached to `/import` endpoint. Authorization token `{github-account}:{PASSWORD}` is hard-coded and is set to local storage on application bootstrap.

[AWS Cognito User Pool App Client Hosted UI](https://dosfklikrk6wd.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=amj83gn4f7cr7rbidsls1s2nr&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdosfklikrk6wd.cloudfront.net%2F) - configured via AWS Console. Redirects to app upon signing-in.

## Available Scripts

### `cdk:bootstrap`

Provisioning resources for the AWS CDK before deploying AWS CDK apps into an AWS environment

### `cdk:deploy`

Deploys built app from `dist` folder into an AWS environment

### `cdk:destroy`

Destroys AWS stack & deletes S3 bucket, CloudFront distribution an CloudFormation stack

### `start`

Starts the project in dev mode with mocked API on local environment.

### `build`

Builds the project for production in `dist` folder.

### `preview`

Starts the project in production mode on local environment.

### `test`, `test:ui`, `test:coverage`

Runs tests in console, in browser or with coverage.

### `lint`, `prettier`

Runs linting and formatting for all files in `src` folder.

## How-to

If the changes are made to the React project, they can be delivered to the deploy by running `npm run build` and `npm run cdk:deploy`.

## Trivia

The project uses the following technologies:

- [Vite](https://vitejs.dev/) as a project bundler
- [React](https://beta.reactjs.org/) as a frontend framework
- [React-router-dom](https://reactrouterdotcom.fly.dev/) as a routing library
- [MUI](https://mui.com/) as a UI framework
- [React-query](https://react-query-v3.tanstack.com/) as a data fetching library
- [Formik](https://formik.org/) as a form library
- [Yup](https://github.com/jquense/yup) as a validation schema
- [Vitest](https://vitest.dev/) as a test runner
- [MSW](https://mswjs.io/) as an API mocking library
- [Eslint](https://eslint.org/) as a code linting tool
- [Prettier](https://prettier.io/) as a code formatting tool
- [TypeScript](https://www.typescriptlang.org/) as a type checking tool