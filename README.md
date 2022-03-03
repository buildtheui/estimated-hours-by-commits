# estimated-hours-by-commits

Web app that shows a rough estimation using the git commits on a project

use the following command to convert the commits to JSON:

```bash
git log --pretty=format:'{%n "commit":"%h","title":"%s","date":"%cD" %n},'
```

## Getting started

run the project with:

```bash
yarn dev
```

build the project with:

```bash
yarn build
```
