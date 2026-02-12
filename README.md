# starter

Starting point for new projects

## Getting started

### Create .env files

1. Create `.env.alchemy` for alchemy specific environment variables.
```
touch .env.alchemy
```

Add these values inside. Both are required for Alchemy to work properly.
```
# I like to gen both of these w/ `openssl rand -base64 32`, don't lose them!
ALCHEMY_STATE_TOKEN="xyz-123"
ALCHEMY_SECRET_PASSWORD="xyz-123"
```

2. Create `.env.${stage}` file for every stage you plan to run app in (including local - which will be the output of the `whoami` command). These files will be used for environment variables your application(s) need access to.
```
touch .env.$(whoami)
touch .env.staging
touch .env.production
```


### Modify @repo/infra to add deploy scripts
Edit `packages/infra/package.json` to include scripts for deploy/destroying stages. Make sure to replace {APP_NAME_HERE} with your "base" app name. 

I like to make this whatever the `name` is in my root `package.json`

```
"scripts": {
    ...
    "deploy:staging": "NODE_ENV=production alchemy deploy --app {APP_NAME_HERE} --stage staging",
    "deploy:production": "NODE_ENV=production alchemy deploy --app {APP_NAME_HERE} --stage production",
    "destroy:staging": "alchemy destroy --app {APP_NAME_HERE} --stage staging",
    "destroy:production": "alchemy destroy --app {APP_NAME_HERE} --stage production",
}
```


### Creating new packages
`bun turbo gen`
