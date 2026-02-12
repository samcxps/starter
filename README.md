# starter

Starting point for new projects

## Getting started

### Create .env files

1. Create `.env.alchemy` for alchemy specific environment variables and set the values.
```
touch .env.alchemy
```

Add these values inside. Both are required for Alchemy to work properly.
```
# I like to gen both of these w/ `openssl rand -base64 32`, don't lose them!
ALCHEMY_STATE_TOKEN="xyz-123"
ALCHEMY_SECRET_PASSWORD="xyz-123"
```

2. Create `.env` file for every stage (including local)
```
touch .env.$(whoami)
touch .env.staging
touch .env.production
```

```
# Stuff your apps will need
DATABASE_URL="xyz-123"
MY_SUPER_SECRET_THING="xyz-123"
```

### Create deploy scripts
Edit `packages/infra/package.json` to include scripts for deploy/destroying stages. Make sure to switch out the app name.

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
